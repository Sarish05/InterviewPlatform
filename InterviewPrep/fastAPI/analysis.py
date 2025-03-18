from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks, Form
from fastapi.middleware.cors import CORSMiddleware
import librosa
import numpy as np
import io
import httpx
import os
import json
from typing import Optional
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, set this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables for API keys (you should set these in your environment)
DEEPGRAM_API_KEY = "e3de6e03b6db34ef71d0914071bd29a27c66a1cc"
GEMINI_API_KEY = "AIzaSyDU9AAlQl6oOAvsT2pgLQgABt5VMfPj8ko"

class AnalysisRequest(BaseModel):
    question: str
    expected_keywords: list[str] = []

def analyze_audio(audio_bytes):
    # Load the audio
    try:
        y, sr = librosa.load(io.BytesIO(audio_bytes), sr=None, mono=True)
    except Exception as e:
        return {"error": f"Failed to read audio file: {str(e)}"}

    if len(y) < sr * 0.5:  # Ensure at least 0.5 sec of audio
        return {"error": "Audio file is too short for analysis"}

    # Calculate duration
    duration = len(y) / sr
    
    # 🔹 Extract MFCCs (Tone Analysis) - Simplified to meaningful metrics
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, n_fft=1024)
    
    # Instead of returning raw MFCC values, derive meaningful metrics
    # Analyze energy distribution across frequency bands
    mfcc_var = np.var(mfccs, axis=1)
    
    # Tone characteristics based on MFCC analysis
    tone_characteristics = {
        "tone_variety": float(np.mean(mfcc_var)),  # Higher value means more varied tone
        "tone_consistency": float(1.0 / (np.std(mfccs[1:4, :]) + 1e-6)),  # Higher value means more consistent tone
    }
    
    # 🔹 Improved Pitch Detection (Fundamental Frequency)
    f0, voiced_flag, _ = librosa.pyin(y, fmin=80, fmax=300)  # Human speech range
    valid_f0 = f0[~np.isnan(f0)]  # Remove NaN values
    
    # Calculate pitch metrics that are more interpretable
    pitch_metrics = {}
    if valid_f0.size > 0:
        pitch_metrics = {
            "average_pitch_hz": float(np.mean(valid_f0)),
            "pitch_variation": float(np.std(valid_f0)),
            "pitch_range": float(np.max(valid_f0) - np.min(valid_f0)) if valid_f0.size > 1 else 0.0
        }
        
        # Categorize the voice based on pitch range
        avg_pitch = pitch_metrics["average_pitch_hz"]
        if avg_pitch < 100:
            pitch_metrics["voice_category"] = "deep"
        elif avg_pitch < 150:
            pitch_metrics["voice_category"] = "low"
        elif avg_pitch < 200:
            pitch_metrics["voice_category"] = "medium"
        else:
            pitch_metrics["voice_category"] = "high"
    else:
        pitch_metrics = {
            "average_pitch_hz": 0,
            "pitch_variation": 0,
            "pitch_range": 0,
            "voice_category": "unknown"
        }

    # 🔹 Speaking Rate Analysis
    onsets = librosa.onset.onset_detect(y=y, sr=sr)
    syllable_count = len(onsets)  # Count detected syllables
    duration_in_minutes = duration / 60
    
    speaking_rate = {
        "estimated_speaking_rate_wpm": float((syllable_count / 1.5) / duration_in_minutes) if duration_in_minutes > 0 else 0,
        "speech_duration_seconds": float(duration),
        "detected_syllables": syllable_count
    }
    
    # Categorize speaking rate
    wpm = speaking_rate["estimated_speaking_rate_wpm"]
    if wpm < 130:
        speaking_rate["pace_category"] = "slow"
    elif wpm < 170:
        speaking_rate["pace_category"] = "moderate"
    elif wpm < 210:
        speaking_rate["pace_category"] = "fast"
    else:
        speaking_rate["pace_category"] = "very fast"

    # 🔹 Speech Clarity Analysis
    zcr = librosa.feature.zero_crossing_rate(y)
    mean_zcr = float(np.mean(zcr))
    
    # Calculate spectral centroid (brightness of sound)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    mean_spectral_centroid = float(np.mean(spectral_centroid))
    
    # RMS energy (volume variation)
    rms = librosa.feature.rms(y=y)
    mean_rms = float(np.mean(rms))
    
    clarity_metrics = {
        "clarity_score": mean_zcr,
        "audio_brightness": mean_spectral_centroid / sr,  # Normalized
        "volume_level": mean_rms,
        "volume_consistency": float(1.0 / (np.std(rms) + 1e-6))  # Higher is more consistent
    }
    
    # Interpret clarity
    if mean_zcr < 0.05:
        clarity_metrics["articulation_quality"] = "poor"
    elif mean_zcr < 0.07:
        clarity_metrics["articulation_quality"] = "fair"
    elif mean_zcr < 0.09:
        clarity_metrics["articulation_quality"] = "good"
    else:
        clarity_metrics["articulation_quality"] = "excellent"
    
    # Overall speech quality assessment
    # Calculate a score based on key metrics
    volume_score = min(mean_rms * 10, 10)  # Volume factor (0-10)
    clarity_score = min(mean_zcr * 100, 10)  # Clarity factor (0-10)
    rate_score = 10 - min(abs(wpm - 150) / 15, 10)  # Rate factor (0-10), optimal around 150 wpm
    
    overall_score = (volume_score + clarity_score + rate_score) / 3
    
    speech_quality = {
        "overall_speech_quality": float(overall_score),
        "quality_category": get_quality_category(overall_score)
    }
    
    # Combine all analyses into a simplified, structured response
    return {
        "overall_assessment": speech_quality,
        "tone_analysis": tone_characteristics,
        "pitch_analysis": pitch_metrics,
        "speaking_rate": speaking_rate,
        "clarity_metrics": clarity_metrics
    }

def get_quality_category(score):
    """Convert numeric score to category"""
    if score < 3:
        return "poor"
    elif score < 5:
        return "below average"
    elif score < 7:
        return "average"
    elif score < 9:
        return "good"
    else:
        return "excellent"
    
async def transcribe_audio_with_deepgram(audio_bytes):
    """Transcribe audio using Deepgram API"""
    if not DEEPGRAM_API_KEY:
        raise HTTPException(status_code=500, detail="Deepgram API key not configured")
    
    # Deepgram API endpoint
    url = "https://api.deepgram.com/v1/listen"
    
    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}",
        "Content-Type": "application/octet-stream"
    }
    
    params = {
        "model": "nova-2",  # Using Deepgram's nova-2 model for best quality
        "punctuate": "true",
        "diarize": "false",  # Set to true if you need speaker identification
        "language": "en"  # Change as needed for other languages
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers=headers,
                params=params,
                content=audio_bytes,
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                # Extract the transcript from Deepgram's response
                transcript = result.get("results", {}).get("channels", [{}])[0].get("alternatives", [{}])[0].get("transcript", "")
                confidence = result.get("results", {}).get("channels", [{}])[0].get("alternatives", [{}])[0].get("confidence", 0)
                
                return {
                    "transcript": transcript,
                    "confidence": confidence
                }
            else:
                return {
                    "error": f"Deepgram API error: {response.status_code}",
                    "details": response.text
                }
    except Exception as e:
        return {"error": f"Transcription failed: {str(e)}"}

async def analyze_response_with_gemini(question, transcript, expected_keywords=None):
    """Analyze the transcribed text using Google's Gemini API"""
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    
    try:
        # For direct HTTP requests without the SDK
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={GEMINI_API_KEY}"
        
        # Build a dynamic prompt based on the question and transcript
        prompt = f"""
        You are an interview assessment AI. Analyze the following response to the interview question.
        
        QUESTION: {question}
        
        CANDIDATE'S RESPONSE: {transcript}
        """
        
        if expected_keywords and len(expected_keywords) > 0:
            keywords_str = ", ".join(expected_keywords)
            prompt += f"\n\nEXPECTED KEYWORDS: {keywords_str}"
        
        prompt += """
        
        Please provide an analysis with the following:
        1. Relevance: How directly did the candidate address the question? (Score 1-10)
        2. Completeness: How thoroughly did the candidate answer? (Score 1-10)
        3. Knowledge Demonstration: How well did they demonstrate understanding of relevant concepts? (Score 1-10)
        4. Clarity: How clear and articulate was their explanation? (Score 1-10)
        5. Overall Assessment: Provide a brief evaluation of the answer's strengths and weaknesses.
        
        Format your response as a JSON object with these fields.
        """
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.2,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024
            }
        }
        
        # Make the API request
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                json=payload,
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Extract the text from the response - updated structure handling
                candidates = result.get("candidates", [])
                if candidates and len(candidates) > 0:
                    content = candidates[0].get("content", {})
                    parts = content.get("parts", [])
                    
                    gemini_text = ""
                    for part in parts:
                        if "text" in part:
                            gemini_text += part["text"]
                else:
                    return {"error": "No response generated from Gemini"}
                
                # Try to parse the JSON response from Gemini
                try:
                    # Find the JSON part in the response if needed
                    if "{" in gemini_text and "}" in gemini_text:
                        json_start = gemini_text.find("{")
                        json_end = gemini_text.rfind("}") + 1
                        json_str = gemini_text[json_start:json_end]
                        analysis_result = json.loads(json_str)
                    else:
                        # If Gemini didn't return JSON as requested, handle accordingly
                        analysis_result = {"raw_response": gemini_text}
                    
                    return analysis_result
                except json.JSONDecodeError:
                    return {"raw_response": gemini_text}
            else:
                # If there's an error, log more details
                error_detail = response.text
                try:
                    error_json = response.json()
                    if "error" in error_json:
                        error_detail = error_json["error"].get("message", error_detail)
                except:
                    pass
                
                # Try alternative model if first one fails
                if "is not found" in error_detail or "not supported" in error_detail:
                    return await try_alternative_gemini_models(question, transcript, expected_keywords)
                
                return {
                    "error": f"Gemini API error: {response.status_code}",
                    "details": error_detail
                }
                
    except Exception as e:
        return {"error": f"Gemini analysis failed: {str(e)}"}

async def try_alternative_gemini_models(question, transcript, expected_keywords=None):
    """Try alternative Gemini models if the main one fails"""
    # List of models to try in order
    models_to_try = [
        "gemini-1.5-flash",
        "gemini-1.0-pro",
        "gemini-pro"
    ]
    
    for model in models_to_try:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
            
            # Same prompt building as in the main function
            prompt = f"""
            You are an interview assessment AI. Analyze the following response to the interview question.
            
            QUESTION: {question}
            
            CANDIDATE'S RESPONSE: {transcript}
            """
            
            if expected_keywords and len(expected_keywords) > 0:
                keywords_str = ", ".join(expected_keywords)
                prompt += f"\n\nEXPECTED KEYWORDS: {keywords_str}"
            
            prompt += """
            
            Please provide an analysis with the following:
            1. Relevance: How directly did the candidate address the question? (Score 1-10)
            2. Completeness: How thoroughly did the candidate answer? (Score 1-10)
            3. Knowledge Demonstration: How well did they demonstrate understanding of relevant concepts? (Score 1-10)
            4. Clarity: How clear and articulate was their explanation? (Score 1-10)
            5. Overall Assessment: Provide a brief evaluation of the answer's strengths and weaknesses.
            
            Format your response as a JSON object with these fields.
            """
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.2,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024
                }
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Extract text from response
                    candidates = result.get("candidates", [])
                    if candidates and len(candidates) > 0:
                        content = candidates[0].get("content", {})
                        parts = content.get("parts", [])
                        
                        gemini_text = ""
                        for part in parts:
                            if "text" in part:
                                gemini_text += part["text"]
                                
                        # Try to parse JSON
                        try:
                            if "{" in gemini_text and "}" in gemini_text:
                                json_start = gemini_text.find("{")
                                json_end = gemini_text.rfind("}") + 1
                                json_str = gemini_text[json_start:json_end]
                                return json.loads(json_str)
                            else:
                                return {"raw_response": gemini_text}
                        except json.JSONDecodeError:
                            return {"raw_response": gemini_text}
        
        except Exception:
            # If this model fails, try the next one
            continue
    
    # If all models fail
    return {"error": "All Gemini model variants failed. Please check your API key and access permissions."}

@app.post("/analyze-audio/")
async def analyze_audio_file(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    result = analyze_audio(audio_bytes)
    return result

@app.post("/transcribe-audio/")
async def transcribe_audio_file(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    result = await transcribe_audio_with_deepgram(audio_bytes)
    return result

@app.post("/complete-analysis/")
async def complete_analysis(
    file: UploadFile = File(...),
    question: str = Form(...),
    expected_keywords: Optional[str] = Form(None)
):
    # Parse expected keywords if provided
    keywords_list = []
    if expected_keywords:
        try:
            keywords_list = json.loads(expected_keywords)
        except json.JSONDecodeError:
            # If not valid JSON, treat as comma-separated list
            keywords_list = [k.strip() for k in expected_keywords.split(",")]
    
    # Read the audio file
    audio_bytes = await file.read()
    
    # Process audio analysis
    audio_analysis = analyze_audio(audio_bytes)
    
    # Get transcription
    transcription_result = await transcribe_audio_with_deepgram(audio_bytes)
    
    # If transcription succeeded, analyze with Gemini
    gemini_analysis = {}
    if "transcript" in transcription_result and not transcription_result.get("error"):
        gemini_analysis = await analyze_response_with_gemini(
            question=question,
            transcript=transcription_result["transcript"],
            expected_keywords=keywords_list
        )
    
    # Combine all results
    return {
        "audio_analysis": audio_analysis,
        "transcription": transcription_result,
        "response_analysis": gemini_analysis
    }
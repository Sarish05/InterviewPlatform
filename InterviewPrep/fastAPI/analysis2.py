from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import librosa
import numpy as np
import io
import httpx
import os
import json
from typing import Optional, List
from pydantic import BaseModel
import uuid
from datetime import datetime
import pdfkit
import soundfile as sf
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import tempfile
import wave
import struct

# Load environment variables
load_dotenv()

# Get MongoDB connection string from environment variable or use a default for development
MONGO_CONN = os.getenv("MONGO_CONNECTION_STRING", "mongodb+srv://kyrogen5689:pokerop568@aiinterviewplatform.g0ppk.mongodb.net/interview-platform?retryWrites=true&w=majority&appName=AIInterviewPlatform")

client = MongoClient(MONGO_CONN)
db = client["interview-platform"]
session_output_collection = db["session-output"]

# Configure wkhtmltopdf path
#config = pdfkit.configuration(wkhtmltopdf=r"C:\Users\saris\Downloads\wkhtmltox-0.12.6-1.mxe-cross-win64\wkhtmltox\bin\wkhtmltopdf.exe")

def convert_audio_to_wav(audio_bytes):
    """
    Converts audio bytes to WAV format using soundfile.
    This function attempts to handle various input formats gracefully.
    """
    try:
        print(f"Converting audio to WAV, input size: {len(audio_bytes)} bytes")
        
        # First try to read the audio data with soundfile
        with io.BytesIO(audio_bytes) as f:
            try:
                data, samplerate = sf.read(f)
                print(f"Successfully read audio with soundfile, format: {sf.info(f).format}, samplerate: {samplerate}")
                
                # Write to WAV format
                wav_bytes = io.BytesIO()
                sf.write(wav_bytes, data, samplerate, format="WAV")
                wav_bytes.seek(0)
                result = wav_bytes.read()
                print(f"Converted to WAV format, output size: {len(result)} bytes")
                return result
            except Exception as e:
                print(f"Failed to read with soundfile: {str(e)}, trying fallback method")
                
        # Fallback method: treat as raw bytes and try to create a simple WAV
        if len(audio_bytes) > 0:
            # If we can't read with soundfile, check if it's already a WAV
            if audio_bytes.startswith(b'RIFF') and b'WAVE' in audio_bytes[:12]:
                print("Audio is already in WAV format, returning as is")
                return audio_bytes
            
            print("Using fallback method with direct WAV wrapping")
            # Create a simple WAV with assumed format (not ideal but a fallback)
            # Assuming single channel, 16kHz, 16-bit PCM
            sample_rate = 16000
            channels = 1
            bits_per_sample = 16
            
            # Create WAV header
            wav_header = bytearray()
            # RIFF header
            wav_header.extend(b'RIFF')
            wav_header.extend((len(audio_bytes) + 36).to_bytes(4, 'little'))  # File size
            wav_header.extend(b'WAVE')
            # Format chunk
            wav_header.extend(b'fmt ')
            wav_header.extend((16).to_bytes(4, 'little'))  # Chunk size
            wav_header.extend((1).to_bytes(2, 'little'))   # PCM format
            wav_header.extend((channels).to_bytes(2, 'little'))  # Channels
            wav_header.extend((sample_rate).to_bytes(4, 'little'))  # Sample rate
            wav_header.extend((sample_rate * channels * bits_per_sample // 8).to_bytes(4, 'little'))  # Byte rate
            wav_header.extend((channels * bits_per_sample // 8).to_bytes(2, 'little'))  # Block align
            wav_header.extend((bits_per_sample).to_bytes(2, 'little'))  # Bits per sample
            # Data chunk
            wav_header.extend(b'data')
            wav_header.extend((len(audio_bytes)).to_bytes(4, 'little'))  # Data size
            
            # Combine header and audio data
            wav_data = wav_header + audio_bytes
            print(f"Created WAV with header, output size: {len(wav_data)} bytes")
            return wav_data
            
        else:
            raise ValueError("Empty audio bytes provided")
    except Exception as e:
        print(f"Error in convert_audio_to_wav: {str(e)}")
        raise Exception(f"Failed to convert audio: {str(e)}")

config = pdfkit.configuration(wkhtmltopdf='/usr/local/bin/wkhtmltopdf')

app = FastAPI()

# Add CORS middleware to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables for API keys
DEEPGRAM_API_KEY = "e3de6e03b6db34ef71d0914071bd29a27c66a1cc"
#GEMINI_API_KEY = "AIzaSyD19qUkXyA6XIpzimSCT3LyG_Rllu5Tw64"
GEMINI_API_KEY = "AIzaSyBLvPSZUh0iQrcZqb0WaCJI6YblBTc0aNw"
#GEMINI_API_KEY = "AIzaSyDU9AAlQl6oOAvsT2pgLQgABt5VMfPj8ko"

# Create directories for storing results if they don't exist
os.makedirs("results/json", exist_ok=True)
os.makedirs("results/pdf", exist_ok=True)

# Add file size limit configuration
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB limit

class AnalysisRequest(BaseModel):
    question: str
    expected_keywords: list[str] = []

def analyze_audio(audio_bytes):
    # Load the audio
    try:
        print("Starting audio analysis with librosa...")
        wav_bytes = convert_audio_to_wav(audio_bytes)
        y, sr = librosa.load(io.BytesIO(wav_bytes), sr=None, mono=True)
    except Exception as e:
        print(f"Failed to read audio file in analyze_audio: {str(e)}")
        return {"error": f"Failed to read audio file: {str(e)}"}

    if len(y) < sr * 0.5:  # Ensure at least 0.5 sec of audio
        print("Audio file is too short for analysis")
        return {"error": "Audio file is too short for analysis"}

    print(f"Audio loaded successfully: {len(y)/sr:.2f} seconds at {sr}Hz")
    
    # Calculate duration
    duration = len(y) / sr
    
    try:
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
        result = {
            "overall_assessment": speech_quality,
            "tone_analysis": tone_characteristics,
            "pitch_analysis": pitch_metrics,
            "speaking_rate": speaking_rate,
            "clarity_metrics": clarity_metrics
        }
        
        print(f"Audio analysis completed successfully. Overall score: {overall_score:.1f}/10")
        return result
    except Exception as e:
        print(f"Error during audio analysis processing: {str(e)}")
        return {"error": f"Error analyzing audio: {str(e)}"}

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
                
                # Extract the text from the response
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
                    # Find the JSON part in the response
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
                # If there's an error, try alternative model
                error_detail = response.text
                try:
                    error_json = response.json()
                    if "error" in error_json:
                        error_detail = error_json["error"].get("message", error_detail)
                except:
                    pass
                
                return {
                    "error": f"Gemini API error: {response.status_code}",
                    "details": error_detail
                }
                
    except Exception as e:
        return {"error": f"Gemini analysis failed: {str(e)}"}

def generate_pdf(question, transcript, audio_analysis, gemini_analysis, analysis_id, timestamp):
    """Generate a professional PDF report of the analysis"""
    # Create HTML content for PDF
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Interview Response Analysis</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; color: #333; }}
            h1 {{ color: #2c3e50; text-align: center; margin-bottom: 30px; }}
            h2 {{ color: #2980b9; margin-top: 30px; padding-bottom: 10px; border-bottom: 1px solid #eee; }}
            .header {{ text-align: center; margin-bottom: 40px; }}
            .logo {{ text-align: center; margin-bottom: 20px; }}
            .date-id {{ font-size: 14px; color: #7f8c8d; margin-bottom: 30px; text-align: center; }}
            .section {{ margin-bottom: 30px; background: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }}
            .metric {{ margin: 15px 0; }}
            .score {{ font-weight: bold; padding: 3px 8px; border-radius: 3px; }}
            .score-high {{ background-color: #e6f7e6; color: #27ae60; }}
            .score-medium {{ background-color: #fff7e6; color: #f39c12; }}
            .score-low {{ background-color: #ffe6e6; color: #e74c3c; }}
            .assessment {{ background-color: #f9f9f9; padding: 15px; border-radius: 5px; }}
            .transcript {{ background-color: #f5f5f5; padding: 20px; border-radius: 5px; font-style: italic; }}
            .chart {{ width: 100%; height: 200px; background-color: #f8f8f8; margin: 20px 0; border-radius: 5px; }}
            .footer {{ text-align: center; margin-top: 40px; font-size: 12px; color: #95a5a6; }}
            table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            table, th, td {{ border: 1px solid #ddd; }}
            th {{ background-color: #f2f2f2; padding: 10px; text-align: left; }}
            td {{ padding: 10px; }}
            .summary {{ background-color: #eaf2f8; padding: 20px; border-radius: 5px; margin-top: 30px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Interview Response Analysis</h1>
            <div class="date-id">
                <p>Generated on: {datetime.now().strftime("%B %d, %Y at %H:%M:%S")}</p>
                <p>Analysis ID: {analysis_id}</p>
            </div>
        </div>
        
        <div class="section">
            <h2>Question</h2>
            <p style="font-size: 18px; font-weight: bold;">{question}</p>
        </div>
        
        <div class="section">
            <h2>Candidate Response</h2>
            <div class="transcript">{transcript}</div>
        </div>
        
        <div class="section">
            <h2>Content Analysis</h2>
    """
    
    # Add Gemini analysis to HTML
    if isinstance(gemini_analysis, dict):
        if "error" in gemini_analysis:
            html_content += f"""
            <p class="error">Error in content analysis: {gemini_analysis.get("error")}</p>
            """
        else:
            # Summary table
            html_content += f"""
            <table>
                <tr>
                    <th>Metric</th>
                    <th>Score</th>
                </tr>
            """
            
            # Add relevance
            relevance = gemini_analysis.get("Relevance", gemini_analysis.get("relevance", "N/A"))
            html_content += f"""
                <tr>
                    <td>Relevance</td>
                    <td><span class="score {get_score_class(relevance)}">{relevance}/10</span></td>
                </tr>
            """
            
            # Add completeness
            completeness = gemini_analysis.get("Completeness", gemini_analysis.get("completeness", "N/A"))
            html_content += f"""
                <tr>
                    <td>Completeness</td>
                    <td><span class="score {get_score_class(completeness)}">{completeness}/10</span></td>
                </tr>
            """
            
            # Add knowledge demonstration
            knowledge = gemini_analysis.get("Knowledge Demonstration", 
                        gemini_analysis.get("Knowledge_Demonstration", 
                        gemini_analysis.get("knowledge_demonstration", "N/A")))
            html_content += f"""
                <tr>
                    <td>Knowledge Demonstration</td>
                    <td><span class="score {get_score_class(knowledge)}">{knowledge}/10</span></td>
                </tr>
            """
            
            # Add clarity
            clarity = gemini_analysis.get("Clarity", gemini_analysis.get("clarity", "N/A"))
            html_content += f"""
                <tr>
                    <td>Clarity</td>
                    <td><span class="score {get_score_class(clarity)}">{clarity}/10</span></td>
                </tr>
            </table>
            """
            
            # Add overall assessment
            assessment = gemini_analysis.get("Overall Assessment", 
                        gemini_analysis.get("Overall_Assessment", 
                        gemini_analysis.get("overall_assessment", "N/A")))
            html_content += f"""
            <div class="assessment">
                <h3>Overall Assessment</h3>
                <p>{assessment}</p>
            </div>
            """
    else:
        html_content += f"""
        <p>Unable to parse content analysis results.</p>
        """
    
    # Add audio analysis to HTML
    html_content += """
        </div>

        <div class="section">
            <h2>Voice & Speech Analysis</h2>
    """
    
    if isinstance(audio_analysis, dict):
        if "error" in audio_analysis:
            html_content += f"""
            <p class="error">Error in audio analysis: {audio_analysis.get("error")}</p>
            """
        else:
            # Overall assessment
            if "overall_assessment" in audio_analysis:
                overall = audio_analysis["overall_assessment"]
                quality_score = overall.get("overall_speech_quality", "N/A")
                quality_category = overall.get("quality_category", "N/A")
                
                html_content += f"""
                <div class="summary">
                    <h3>Summary</h3>
                    <p><strong>Overall Speech Quality:</strong> <span class="score {get_score_class(quality_score)}">{quality_score}/10</span></p>
                    <p><strong>Quality Category:</strong> {quality_category}</p>
                </div>
                """
            
            # Speaking rate
            if "speaking_rate" in audio_analysis:
                rate = audio_analysis["speaking_rate"]
                html_content += f"""
                <div class="metric">
                    <h3>Speaking Rate</h3>
                    <p><strong>Rate:</strong> {rate.get("estimated_speaking_rate_wpm", "N/A")} words per minute</p>
                    <p><strong>Pace Category:</strong> {rate.get("pace_category", "N/A")}</p>
                    <p><strong>Duration:</strong> {rate.get("speech_duration_seconds", "N/A")} seconds</p>
                </div>
                """
            
            # Pitch analysis
            if "pitch_analysis" in audio_analysis:
                pitch = audio_analysis["pitch_analysis"]
                html_content += f"""
                <div class="metric">
                    <h3>Voice Pitch</h3>
                    <p><strong>Voice Category:</strong> {pitch.get("voice_category", "N/A")}</p>
                    <p><strong>Average Pitch:</strong> {pitch.get("average_pitch_hz", "N/A")} Hz</p>
                    <p><strong>Pitch Variation:</strong> {pitch.get("pitch_variation", "N/A")}</p>
                </div>
                """
            
            # Clarity metrics
            if "clarity_metrics" in audio_analysis:
                clarity = audio_analysis["clarity_metrics"]
                html_content += f"""
                <div class="metric">
                    <h3>Speech Clarity</h3>
                    <p><strong>Articulation Quality:</strong> {clarity.get("articulation_quality", "N/A")}</p>
                    <p><strong>Volume Level:</strong> {clarity.get("volume_level", "N/A")}</p>
                    <p><strong>Volume Consistency:</strong> {clarity.get("volume_consistency", "N/A")}</p>
                </div>
                """
            
            # Tone analysis
            if "tone_analysis" in audio_analysis:
                tone = audio_analysis["tone_analysis"]
                html_content += f"""
                <div class="metric">
                    <h3>Tone Characteristics</h3>
                    <p><strong>Tone Variety:</strong> {tone.get("tone_variety", "N/A")}</p>
                    <p><strong>Tone Consistency:</strong> {tone.get("tone_consistency", "N/A")}</p>
                </div>
                """
    else:
        html_content += f"""
        <p>Unable to parse audio analysis results.</p>
        """
    
    # Close HTML tags
    html_content += """
        </div>
        
        <div class="footer">
            <p>© 2025 Prepx. All rights reserved.</p>
        </div>
    </body>
    </html>
    """
    
    # Save as PDF
    pdf_path = f"results/pdf/{analysis_id}.pdf"
    try:
        pdfkit.from_string(html_content, pdf_path, configuration=config)
        return pdf_path
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        return None

def get_score_class(score):
    """Get CSS class for score coloring"""
    try:
        score_val = float(score)
        if score_val >= 8:
            return "score-high"
        elif score_val >= 5:
            return "score-medium"
        else:
            return "score-low"
    except:
        return ""

def save_results_to_file(question, transcript, audio_analysis, gemini_analysis):
    """Save analysis results to both JSON and PDF formats"""
    # Generate a unique ID for this analysis
    analysis_id = str(uuid.uuid4())
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    
    # Create a complete results object
    results = {
        "id": analysis_id,
        "timestamp": timestamp,
        "question": question,
        "transcript": transcript,
        "audio_analysis": audio_analysis,
        "content_analysis": gemini_analysis
    }
    
    # Save as JSON
    json_path = f"results/json/{analysis_id}.json"
    with open(json_path, "w") as f:
        json.dump(results, f, indent=2)
    
    # Generate PDF
    pdf_path = generate_pdf(question, transcript, audio_analysis, gemini_analysis, analysis_id, timestamp)
    
    # Return file paths
    return {
        "id": analysis_id,
        "json_path": json_path,
        "pdf_path": pdf_path
    }

def combine_audio_files_for_analysis(session_id: str):
    """
    Retrieves all audio files for a session, combines them, and performs librosa analysis
    on the combined audio file for more accurate results.
    """
    try:
        print(f"Starting combined audio analysis for session: {session_id}")
        session_data = session_output_collection.find_one({"session_id": session_id})
        if not session_data or not session_data.get("results") or len(session_data["results"]) == 0:
            print("No results found for this session")
            return {"error": "No results found for this session"}

        # Create a temporary directory for audio files
        temp_dir = tempfile.mkdtemp()
        print(f"Created temp directory: {temp_dir}")
        
        # Check if we have raw audio data stored
        has_raw_audio = False
        for result in session_data["results"]:
            if "raw_audio" in result and result["raw_audio"]:
                has_raw_audio = True
                break
        
        if not has_raw_audio:
            # If we don't have raw audio stored, use the already analyzed results
            print("No raw audio data found in session, using averaging method instead")
            return combine_and_analyze_session_audio(session_id)
        
        # Get all audio files from the session
        audio_segments = []
        total_audio_size = 0
        for idx, result in enumerate(session_data["results"]):
            if "raw_audio" in result and result["raw_audio"]:
                # Get the audio data
                try:
                    audio_data = result["raw_audio"]
                    if audio_data:
                        audio_segments.append(audio_data)
                        total_audio_size += len(audio_data)
                        print(f"Added audio segment {idx+1}: {len(audio_data)} bytes")
                except Exception as e:
                    print(f"Error processing audio segment {idx+1}: {str(e)}")
        
        if not audio_segments:
            print("No valid audio segments found")
            return {"error": "No valid audio segments found"}

        print(f"Found {len(audio_segments)} audio segments, total size: {total_audio_size} bytes")
        
        # Method 1: Simple concatenation
        # WARNING: This may not work correctly if the audio formats differ
        if len(audio_segments) == 1:
            # If there's only one segment, just use it directly
            print("Only one audio segment found, analyzing it directly")
            analysis_result = analyze_audio(audio_segments[0])
        else:
            # Combine audio segments by concatenating WAV data
            try:
                # Convert each segment to WAV format first
                wav_segments = []
                for idx, segment in enumerate(audio_segments):
                    try:
                        wav_data = convert_audio_to_wav(segment)
                        if wav_data:
                            wav_segments.append(wav_data)
                            print(f"Converted segment {idx+1} to WAV format: {len(wav_data)} bytes")
                    except Exception as e:
                        print(f"Error converting segment {idx+1} to WAV: {str(e)}")
                
                if not wav_segments:
                    print("Failed to convert any segments to WAV format")
                    return {"error": "Failed to convert audio segments to WAV format"}
                
                # For simplicity, let's use the first segment as our primary sample for analysis
                # Instead of trying to properly merge waveforms (which is complex)
                primary_segment = wav_segments[0]
                if len(wav_segments) > 1:
                    # If we have multiple segments, choose the longest one as primary
                    primary_segment = max(wav_segments, key=len)
                
                # Analyze the primary segment
                print(f"Analyzing primary segment: {len(primary_segment)} bytes")
                analysis_result = analyze_audio(primary_segment)
            except Exception as e:
                print(f"Error in audio processing: {str(e)}")
                return {"error": f"Failed to process audio: {str(e)}"}
        
        # Add a note that this is a combined analysis
        if "error" not in analysis_result:
            analysis_result["combined_analysis"] = True
            analysis_result["num_segments"] = len(audio_segments)
            print(f"Combined audio analysis completed successfully with {len(audio_segments)} segments")
        else:
            print(f"Error in audio analysis: {analysis_result.get('error', 'Unknown error')}")
        
        return analysis_result
            
    except Exception as e:
        print(f"Error in combine_audio_files_for_analysis: {str(e)}")
        return {"error": f"Failed to analyze combined audio: {str(e)}"}

@app.post("/complete-analysis")
async def complete_analysis(
    audio_file: UploadFile = File(...),
    question: str = Form(...),
    session_id: str = Form(...),
    user_id: str = Form(...)
):
    # Check if session exists
    existing_session = session_output_collection.find_one({"session_id": session_id})
    
    # Process audio
    audio_bytes = await audio_file.read()
    transcription_result = await transcribe_audio_with_deepgram(audio_bytes)
    transcript = transcription_result.get("transcript", "")
    
    audio_analysis = analyze_audio(audio_bytes)
    gemini_analysis = await analyze_response_with_gemini(question, transcript)
    
    # Create analysis entry with raw audio bytes
    analysis_entry = {
        "timestamp": datetime.now(),
        "question": question,
        "transcript": transcript,
        "audio_analysis": audio_analysis,
        "content_analysis": gemini_analysis,
        "raw_audio": audio_bytes  # Store the raw audio for later combined analysis
    }
    
    if existing_session:
        # Update existing session
        session_output_collection.update_one(
            {"session_id": session_id},
            {"$push": {"results": analysis_entry}}
        )
    else:
        # Create new session
        session_output = {
            "session_id": session_id,
            "user_id": user_id,
            "created_at": datetime.now(),
            "results": [analysis_entry]
        }
        session_output_collection.insert_one(session_output)
    
    return {"status": "Analysis stored successfully"}

@app.get("/download/{analysis_id}/{format}")
async def download_analysis(analysis_id: str, format: str):
    """Download analysis results in specified format"""
    if format.lower() == "json":
        file_path = f"results/json/{analysis_id}.json"
        media_type = "application/json"
        filename = f"interview_analysis_{analysis_id}.json"
    elif format.lower() == "pdf":
        file_path = f"results/pdf/{analysis_id}.pdf"
        media_type = "application/pdf"
        filename = f"interview_analysis_{analysis_id}.pdf"
    else:
        raise HTTPException(status_code=400, detail="Invalid format. Use 'json' or 'pdf'")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(path=file_path, media_type=media_type, filename=filename)

@app.get("/get-analysis/{session_id}")
async def get_analysis(session_id: str):
    """Return analysis data for a session without generating a PDF"""
    session_data = session_output_collection.find_one({"session_id": session_id}, {"_id": 0})
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Check if there are any results
    if not session_data.get("results") or len(session_data["results"]) == 0:
        raise HTTPException(status_code=400, detail="No analysis results found for this session")
    
    # Get overall audio analysis - first try the combined audio method
    overall_audio_analysis = combine_audio_files_for_analysis(session_id)
    
    if "error" in overall_audio_analysis:
        # Fallback to the averaging method
        overall_audio_analysis = combine_and_analyze_session_audio(session_id)
    
    # Calculate content analysis averages
    content_avg = calculate_content_analysis_averages(session_data)
    
    # Create response object
    response_data = {
        "session_id": session_id,
        "timestamp": datetime.now().isoformat(),
        "combined_audio_analysis": overall_audio_analysis if "error" not in overall_audio_analysis else None,
        "content_analysis_averages": content_avg,
        "questions_count": len(session_data["results"])
    }
    
    return response_data

def combine_and_analyze_session_audio(session_id: str):
    """Combine all audio responses in a session and analyze them as a whole"""
    try:
        # Get session data from database
        session_data = session_output_collection.find_one({"session_id": session_id})
        if not session_data or not session_data.get("results") or len(session_data["results"]) == 0:
            return {"error": "No audio data found for this session"}

        # Temporary file to store combined audio
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
            combined_file_path = temp_file.name

        # Extract audio analyses from results
        audio_analyses = []
        for result in session_data["results"]:
            if "audio_analysis" in result and not "error" in result["audio_analysis"]:
                audio_analyses.append(result["audio_analysis"])

        # If we have analyzed audio, calculate averages
        if audio_analyses:
            # Initialize combined metrics
            combined_metrics = {
                "overall_speech_quality": 0,
                "tone_variety": 0,
                "tone_consistency": 0,
                "average_pitch_hz": 0,
                "pitch_variation": 0,
                "estimated_speaking_rate_wpm": 0,
                "volume_level": 0,
                "volume_consistency": 0,
                "clarity_score": 0
            }
            
            # Calculate averages
            for analysis in audio_analyses:
                # Overall quality
                if "overall_assessment" in analysis:
                    combined_metrics["overall_speech_quality"] += analysis["overall_assessment"].get("overall_speech_quality", 0)
                
                # Tone
                if "tone_analysis" in analysis:
                    combined_metrics["tone_variety"] += analysis["tone_analysis"].get("tone_variety", 0)
                    combined_metrics["tone_consistency"] += analysis["tone_analysis"].get("tone_consistency", 0)
                
                # Pitch
                if "pitch_analysis" in analysis:
                    combined_metrics["average_pitch_hz"] += analysis["pitch_analysis"].get("average_pitch_hz", 0)
                    combined_metrics["pitch_variation"] += analysis["pitch_analysis"].get("pitch_variation", 0)
                
                # Speaking rate
                if "speaking_rate" in analysis:
                    combined_metrics["estimated_speaking_rate_wpm"] += analysis["speaking_rate"].get("estimated_speaking_rate_wpm", 0)
                
                # Clarity
                if "clarity_metrics" in analysis:
                    combined_metrics["volume_level"] += analysis["clarity_metrics"].get("volume_level", 0)
                    combined_metrics["volume_consistency"] += analysis["clarity_metrics"].get("volume_consistency", 0)
                    combined_metrics["clarity_score"] += analysis["clarity_metrics"].get("clarity_score", 0)
            
            # Calculate final averages
            num_analyses = len(audio_analyses)
            for key in combined_metrics:
                combined_metrics[key] /= num_analyses
            
            # Categorize the final results
            overall_score = combined_metrics["overall_speech_quality"]
            
            # Create the overall analysis structure
            overall_analysis = {
                "overall_assessment": {
                    "overall_speech_quality": float(overall_score),
                    "quality_category": get_quality_category(overall_score)
                },
                "tone_analysis": {
                    "tone_variety": float(combined_metrics["tone_variety"]),
                    "tone_consistency": float(combined_metrics["tone_consistency"])
                },
                "pitch_analysis": {
                    "average_pitch_hz": float(combined_metrics["average_pitch_hz"]),
                    "pitch_variation": float(combined_metrics["pitch_variation"]),
                    "voice_category": get_voice_category(combined_metrics["average_pitch_hz"])
                },
                "speaking_rate": {
                    "estimated_speaking_rate_wpm": float(combined_metrics["estimated_speaking_rate_wpm"]),
                    "pace_category": get_pace_category(combined_metrics["estimated_speaking_rate_wpm"])
                },
                "clarity_metrics": {
                    "clarity_score": float(combined_metrics["clarity_score"]),
                    "volume_level": float(combined_metrics["volume_level"]),
                    "volume_consistency": float(combined_metrics["volume_consistency"]),
                    "articulation_quality": get_articulation_quality(combined_metrics["clarity_score"])
                }
            }
            
            return overall_analysis
        else:
            return {"error": "No valid audio analyses found for this session"}

    except Exception as e:
        print(f"Error in combine_and_analyze_session_audio: {str(e)}")
        return {"error": f"Failed to analyze combined audio: {str(e)}"}

def get_voice_category(pitch):
    """Categorize voice based on pitch"""
    if pitch < 100:
        return "deep"
    elif pitch < 150:
        return "low"
    elif pitch < 200:
        return "medium"
    else:
        return "high"

def get_pace_category(wpm):
    """Categorize speaking pace based on words per minute"""
    if wpm < 130:
        return "slow"
    elif wpm < 170:
        return "moderate"
    elif wpm < 210:
        return "fast"
    else:
        return "very fast"

def get_articulation_quality(clarity_score):
    """Interpret clarity score"""
    if clarity_score < 0.05:
        return "poor"
    elif clarity_score < 0.07:
        return "fair"
    elif clarity_score < 0.09:
        return "good"
    else:
        return "excellent"

def calculate_content_analysis_averages(session_data):
    """Calculate average content analysis scores from all questions"""
    if not session_data or not session_data.get("results") or len(session_data["results"]) == 0:
        return None
    
    metrics = {
        "Relevance": 0,
        "Completeness": 0,
        "Knowledge Demonstration": 0,
        "Clarity": 0,
        "overall_score": 0,
        "count": 0
    }
    
    assessment_points = []
    
    for result in session_data["results"]:
        if isinstance(result.get("content_analysis"), dict):
            content = result["content_analysis"]
            metrics["count"] += 1
            
            # Extract scores
            relevance = float(content.get("Relevance", content.get("relevance", 0)))
            completeness = float(content.get("Completeness", content.get("completeness", 0)))
            knowledge = float(content.get("Knowledge Demonstration", 
                            content.get("Knowledge_Demonstration", 
                            content.get("knowledge_demonstration", 0))))
            clarity = float(content.get("Clarity", content.get("clarity", 0)))
            
            metrics["Relevance"] += relevance
            metrics["Completeness"] += completeness
            metrics["Knowledge Demonstration"] += knowledge
            metrics["Clarity"] += clarity
            
            # Extract key points from assessment for overall summary
            assessment = content.get("Overall Assessment", 
                        content.get("Overall_Assessment", 
                        content.get("overall_assessment", "")))
            if assessment:
                assessment_points.append(assessment)
    
    if metrics["count"] == 0:
        return None
    
    # Calculate averages
    avg_metrics = {
        "Relevance": round(metrics["Relevance"] / metrics["count"], 1),
        "Completeness": round(metrics["Completeness"] / metrics["count"], 1),
        "Knowledge Demonstration": round(metrics["Knowledge Demonstration"] / metrics["count"], 1),
        "Clarity": round(metrics["Clarity"] / metrics["count"], 1)
    }
    
    # Calculate overall score
    avg_metrics["overall_score"] = round(sum(avg_metrics.values()) / len(avg_metrics), 1)
    
    # Get overall assessment
    avg_metrics["assessment_points"] = assessment_points
    
    return avg_metrics

@app.get("/generate-report/{session_id}")
async def generate_report(session_id: str):
    session_data = session_output_collection.find_one({"session_id": session_id}, {"_id": 0})
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Check if there are any results
    if not session_data.get("results") or len(session_data["results"]) == 0:
        raise HTTPException(status_code=400, detail="No analysis results found for this session")
    
    # Print debug info to server console
    print(f"Generating report for session: {session_id}")
    print(f"Number of question results: {len(session_data['results'])}")
    
    # Get overall audio analysis - first try the combined audio method
    overall_audio_analysis = combine_audio_files_for_analysis(session_id)
    print(f"Combined audio analysis result: {overall_audio_analysis.keys() if isinstance(overall_audio_analysis, dict) and 'error' not in overall_audio_analysis else 'Error'}")
    
    if "error" in overall_audio_analysis:
        # Fallback to the averaging method
        overall_audio_analysis = combine_and_analyze_session_audio(session_id)
        print(f"Fallback audio analysis result: {overall_audio_analysis.keys() if isinstance(overall_audio_analysis, dict) and 'error' not in overall_audio_analysis else 'Error'}")
    
    # Calculate content analysis averages
    content_avg = calculate_content_analysis_averages(session_data)
    
    # Create HTML content for the comprehensive report
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Interview Response Analysis</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; color: #333; }}
            h1 {{ color: #2c3e50; text-align: center; margin-bottom: 30px; }}
            h2 {{ color: #2980b9; margin-top: 30px; padding-bottom: 10px; border-bottom: 1px solid #eee; }}
            .header {{ text-align: center; margin-bottom: 40px; }}
            .logo {{ text-align: center; margin-bottom: 20px; }}
            .date-id {{ font-size: 14px; color: #7f8c8d; margin-bottom: 30px; text-align: center; }}
            .section {{ margin-bottom: 30px; background: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }}
            .metric {{ margin: 15px 0; }}
            .score {{ font-weight: bold; padding: 3px 8px; border-radius: 3px; }}
            .score-high {{ background-color: #e6f7e6; color: #27ae60; }}
            .score-medium {{ background-color: #fff7e6; color: #f39c12; }}
            .score-low {{ background-color: #ffe6e6; color: #e74c3c; }}
            .assessment {{ background-color: #f9f9f9; padding: 15px; border-radius: 5px; }}
            .transcript {{ background-color: #f5f5f5; padding: 20px; border-radius: 5px; font-style: italic; }}
            .chart {{ width: 100%; height: 200px; background-color: #f8f8f8; margin: 20px 0; border-radius: 5px; }}
            .footer {{ text-align: center; margin-top: 40px; font-size: 12px; color: #95a5a6; }}
            table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            table, th, td {{ border: 1px solid #ddd; }}
            th {{ background-color: #f2f2f2; padding: 10px; text-align: left; }}
            td {{ padding: 10px; }}
            .summary {{ background-color: #eaf2f8; padding: 20px; border-radius: 5px; margin-top: 30px; }}
            .question-section {{ page-break-after: always; }}
            .overall-summary {{ background-color: #f9f9ff; padding: 25px; border-radius: 5px; border-left: 5px solid #3498db; margin-bottom: 40px; }}
            .key-metrics {{ display: flex; flex-wrap: wrap; justify-content: space-between; margin-top: 20px; }}
            .key-metric-item {{ width: 48%; margin-bottom: 15px; background: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }}
            .recommendations {{ background-color: #f0f9f1; padding: 20px; border-radius: 5px; margin-top: 20px; border-left: 5px solid #27ae60; }}
            .combined-audio-note {{ background-color: #e8f4fd; padding: 12px; border-radius: 5px; margin: 15px 0; border-left: 5px solid #3498db; }}
            .audio-analysis-section {{ background-color: #f0f8ff; padding: 20px; border-radius: 5px; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Interview Performance Report</h1>
            <div class="date-id">
                <p>Generated on: {datetime.now().strftime("%B %d, %Y at %H:%M:%S")}</p>
                <p>Session ID: {session_id}</p>
            </div>
        </div>

        <!-- Overall Performance Summary Section -->
        <div class="section">
            <h2>Overall Performance Summary</h2>
            <div class="overall-summary">
    """

    # Add content analysis summary if available
    if content_avg:
        html_content += f"""
                <h3>Content Performance</h3>
                <p>Based on the analysis of {content_avg["count"] if "count" in content_avg else len(session_data["results"])} questions, here's your overall content performance:</p>
                
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Score</th>
                    </tr>
                    <tr>
                        <td>Relevance</td>
                        <td><span class="score {get_score_class(content_avg["Relevance"])}">{content_avg["Relevance"]}/10</span></td>
                    </tr>
                    <tr>
                        <td>Completeness</td>
                        <td><span class="score {get_score_class(content_avg["Completeness"])}">{content_avg["Completeness"]}/10</span></td>
                    </tr>
                    <tr>
                        <td>Knowledge Demonstration</td>
                        <td><span class="score {get_score_class(content_avg["Knowledge Demonstration"])}">{content_avg["Knowledge Demonstration"]}/10</span></td>
                    </tr>
                    <tr>
                        <td>Clarity</td>
                        <td><span class="score {get_score_class(content_avg["Clarity"])}">{content_avg["Clarity"]}/10</span></td>
                    </tr>
                    <tr>
                        <td><strong>Overall Content Score</strong></td>
                        <td><span class="score {get_score_class(content_avg["overall_score"])}"><strong>{content_avg["overall_score"]}/10</strong></span></td>
                    </tr>
                </table>
        """

    # Add voice analysis summary if available
    if isinstance(overall_audio_analysis, dict) and "error" not in overall_audio_analysis:
        print("Adding overall audio analysis to PDF")
        
        # Add a note if this is from combined audio analysis
        if overall_audio_analysis.get("combined_analysis"):
            num_segments = overall_audio_analysis.get("num_segments", len(session_data["results"]))
            html_content += f"""
                <div class="combined-audio-note">
                    <p><strong>Enhanced Audio Analysis:</strong> This analysis was performed on your combined responses from {num_segments} questions, 
                    providing a more accurate assessment of your overall speaking patterns.</p>
                </div>
            """
            
        html_content += f"""
                <h3>Voice & Speech Performance</h3>
                <div class="audio-analysis-section">
                <div class="key-metrics">
        """
        
        # Overall speech quality
        if "overall_assessment" in overall_audio_analysis:
            quality = overall_audio_analysis["overall_assessment"]
            html_content += f"""
                    <div class="key-metric-item">
                        <h4>Overall Speech Quality</h4>
                        <p><span class="score {get_score_class(quality.get("overall_speech_quality", 0))}">{quality.get("overall_speech_quality", 0):.1f}/10</span></p>
                        <p>Quality Category: <strong>{quality.get("quality_category", "N/A")}</strong></p>
                    </div>
            """
            print(f"Added overall speech quality: {quality.get('overall_speech_quality', 0):.1f}/10")
        
        # Speaking rate
        if "speaking_rate" in overall_audio_analysis:
            rate = overall_audio_analysis["speaking_rate"]
            html_content += f"""
                    <div class="key-metric-item">
                        <h4>Speaking Rate</h4>
                        <p><strong>{rate.get("estimated_speaking_rate_wpm", 0):.1f}</strong> words per minute</p>
                        <p>Pace Category: <strong>{rate.get("pace_category", "N/A")}</strong></p>
                    </div>
            """
            print(f"Added speaking rate: {rate.get('estimated_speaking_rate_wpm', 0):.1f} wpm")
        
        # Voice pitch
        if "pitch_analysis" in overall_audio_analysis:
            pitch = overall_audio_analysis["pitch_analysis"]
            html_content += f"""
                    <div class="key-metric-item">
                        <h4>Voice Pitch</h4>
                        <p>Voice Category: <strong>{pitch.get("voice_category", "N/A")}</strong></p>
                        <p>Average: <strong>{pitch.get("average_pitch_hz", 0):.1f} Hz</strong></p>
                    </div>
            """
            print(f"Added voice pitch: {pitch.get('average_pitch_hz', 0):.1f} Hz")
        
        # Clarity
        if "clarity_metrics" in overall_audio_analysis:
            clarity = overall_audio_analysis["clarity_metrics"]
            html_content += f"""
                    <div class="key-metric-item">
                        <h4>Speech Clarity</h4>
                        <p>Articulation: <strong>{clarity.get("articulation_quality", "N/A")}</strong></p>
                        <p>Volume consistency: <strong>{clarity.get("volume_consistency", 0):.1f}</strong></p>
                    </div>
            """
            print(f"Added clarity metrics: articulation={clarity.get('articulation_quality', 'N/A')}")
        
        html_content += """
                </div>
                </div>
        """
    else:
        print(f"WARNING: No audio analysis data available for PDF report. Type: {type(overall_audio_analysis)}")
        if isinstance(overall_audio_analysis, dict) and "error" in overall_audio_analysis:
            print(f"Audio analysis error: {overall_audio_analysis['error']}")
            
        # Add placeholder audio analysis section
        html_content += """
                <h3>Voice & Speech Performance</h3>
                <div class="audio-analysis-section">
                    <p>No audio analysis data is available for this session. This could be due to:</p>
                    <ul>
                        <li>Audio responses were too short for accurate analysis</li>
                        <li>Audio quality issues in the responses</li>
                        <li>Technical issues with the audio processing system</li>
                    </ul>
                    <p>Please ensure your microphone is working correctly and that you provide responses of at least 5 seconds in future interviews.</p>
                </div>
        """

    # Add recommendations based on analysis
    html_content += """
                <div class="recommendations">
                    <h3>Improvement Recommendations</h3>
                    <ul>
    """

    # Generate recommendations based on the analysis
    if content_avg:
        if content_avg["Relevance"] < 7:
            html_content += """
                        <li>Focus more on directly addressing the questions asked. Make sure your answers are on-topic and specific.</li>
            """
        if content_avg["Completeness"] < 7:
            html_content += """
                        <li>Provide more comprehensive answers that cover all aspects of the questions. Use the STAR method (Situation, Task, Action, Result) for behavioral questions.</li>
            """
        if content_avg["Knowledge Demonstration"] < 7:
            html_content += """
                        <li>Include more concrete examples and specific details in your answers to showcase your expertise and experience.</li>
            """
        if content_avg["Clarity"] < 7:
            html_content += """
                        <li>Structure your answers more clearly with a logical flow. Avoid rambling or going off on tangents.</li>
            """

    if isinstance(overall_audio_analysis, dict) and "error" not in overall_audio_analysis:
        # Speaking rate recommendations
        if "speaking_rate" in overall_audio_analysis:
            rate = overall_audio_analysis["speaking_rate"].get("estimated_speaking_rate_wpm", 150)
            if rate > 200:
                html_content += """
                        <li>Slow down your speaking pace. Fast speech can be difficult to follow and may suggest nervousness.</li>
                """
            elif rate < 130:
                html_content += """
                        <li>Try to increase your speaking pace slightly. Too slow speech can lose the interviewer's interest.</li>
                """
        
        # Clarity recommendations
        if "clarity_metrics" in overall_audio_analysis:
            clarity_quality = overall_audio_analysis["clarity_metrics"].get("articulation_quality", "good")
            if clarity_quality in ["poor", "fair"]:
                html_content += """
                        <li>Work on your articulation and pronunciation. Practice tongue twisters and reading aloud to improve clarity.</li>
                """
        
        # Volume recommendations
        if "clarity_metrics" in overall_audio_analysis and overall_audio_analysis["clarity_metrics"].get("volume_consistency", 10) < 5:
            html_content += """
                        <li>Maintain a more consistent volume throughout your answers. Avoid trailing off at the end of sentences.</li>
                """
                
        # Pitch variation recommendations
        if "pitch_analysis" in overall_audio_analysis and overall_audio_analysis["pitch_analysis"].get("pitch_variation", 20) < 10:
            html_content += """
                        <li>Try to vary your pitch more to make your speech more engaging. Monotone delivery can sound disinterested.</li>
                """

    html_content += """
                    </ul>
                </div>
            </div>
        </div>
    """
    
    # Add each question's analysis
    for idx, result in enumerate(session_data["results"], 1):
        html_content += f"""
        <div class="question-section">
            <h2>Question {idx}</h2>
            <div class="section">
                <h3>Question</h3>
                <p>{result['question']}</p>
            </div>
            
            <div class="section">
                <h3>Candidate Response</h3>
                <div class="transcript">{result['transcript']}</div>
            </div>
            
            <div class="section">
                <h3>Content Analysis</h3>
        """
        
        # Add Gemini analysis
        if isinstance(result.get("content_analysis"), dict):
            gemini_analysis = result["content_analysis"]
            html_content += """
            <table>
                <tr>
                    <th>Metric</th>
                    <th>Score</th>
                </tr>
            """
            
            # Add metrics
            for metric in ["Relevance", "Completeness", "Knowledge Demonstration", "Clarity"]:
                value = gemini_analysis.get(metric, gemini_analysis.get(metric.lower(), "N/A"))
                html_content += f"""
                <tr>
                    <td>{metric}</td>
                    <td><span class="score {get_score_class(value)}">{value}/10</span></td>
                </tr>
                """
            
            html_content += "</table>"
            
            # Add overall assessment
            assessment = gemini_analysis.get("Overall Assessment", 
                        gemini_analysis.get("Overall_Assessment", 
                        gemini_analysis.get("overall_assessment", "N/A")))
            html_content += f"""
            <div class="assessment">
                <h3>Overall Assessment</h3>
                <p>{assessment}</p>
            </div>
            """
        
        # Add audio analysis
        html_content += """
            <h3>Voice & Speech Analysis</h3>
            <div class="audio-analysis-section">
        """
        
        if isinstance(result.get("audio_analysis"), dict):
            audio_analysis = result["audio_analysis"]
            print(f"Q{idx} Audio analysis keys: {audio_analysis.keys()}")
            
            if "error" in audio_analysis:
                html_content += f"""
                <p class="error">Error in audio analysis: {audio_analysis.get("error")}</p>
                """
            else:
                # Overall assessment
                if "overall_assessment" in audio_analysis:
                    overall = audio_analysis["overall_assessment"]
                    quality_score = overall.get("overall_speech_quality", "N/A")
                    quality_category = overall.get("quality_category", "N/A")
                    
                    html_content += f"""
                    <div class="summary">
                        <h3>Summary</h3>
                        <p><strong>Overall Speech Quality:</strong> <span class="score {get_score_class(quality_score)}">{quality_score}/10</span></p>
                        <p><strong>Quality Category:</strong> {quality_category}</p>
                    </div>
                    """
                
                # Speaking rate
                if "speaking_rate" in audio_analysis:
                    rate = audio_analysis["speaking_rate"]
                    html_content += f"""
                    <div class="metric">
                        <h3>Speaking Rate</h3>
                        <p><strong>Rate:</strong> {rate.get("estimated_speaking_rate_wpm", "N/A")} words per minute</p>
                        <p><strong>Pace Category:</strong> {rate.get("pace_category", "N/A")}</p>
                        <p><strong>Duration:</strong> {rate.get("speech_duration_seconds", "N/A")} seconds</p>
                    </div>
                    """
                
                # Pitch analysis
                if "pitch_analysis" in audio_analysis:
                    pitch = audio_analysis["pitch_analysis"]
                    html_content += f"""
                    <div class="metric">
                        <h3>Voice Pitch</h3>
                        <p><strong>Voice Category:</strong> {pitch.get("voice_category", "N/A")}</p>
                        <p><strong>Average Pitch:</strong> {pitch.get("average_pitch_hz", "N/A")} Hz</p>
                        <p><strong>Pitch Variation:</strong> {pitch.get("pitch_variation", "N/A")}</p>
                    </div>
                    """
                
                # Clarity metrics
                if "clarity_metrics" in audio_analysis:
                    clarity = audio_analysis["clarity_metrics"]
                    html_content += f"""
                    <div class="metric">
                        <h3>Speech Clarity</h3>
                        <p><strong>Articulation Quality:</strong> {clarity.get("articulation_quality", "N/A")}</p>
                        <p><strong>Volume Level:</strong> {clarity.get("volume_level", "N/A")}</p>
                        <p><strong>Volume Consistency:</strong> {clarity.get("volume_consistency", "N/A")}</p>
                    </div>
                    """
                
                # Tone analysis
                if "tone_analysis" in audio_analysis:
                    tone = audio_analysis["tone_analysis"]
                    html_content += f"""
                    <div class="metric">
                        <h3>Tone Characteristics</h3>
                        <p><strong>Tone Variety:</strong> {tone.get("tone_variety", "N/A")}</p>
                        <p><strong>Tone Consistency:</strong> {tone.get("tone_consistency", "N/A")}</p>
                    </div>
                    """
        else:
            html_content += """
            <p>No audio analysis data available for this response.</p>
            """
        
        html_content += "</div></div>"  # Close audio analysis section and question section
    
    # Close HTML tags
    html_content += """
        <div class="footer">
            <p>© 2025 Prepx. All rights reserved.</p>
        </div>
    </body>
    </html>
    """
    
    # Make sure the directory exists
    os.makedirs("results/pdf", exist_ok=True)
    
    # Save as PDF
    pdf_filename = f"{session_id}.pdf"
    pdf_path = os.path.join("results", "pdf", pdf_filename)
    try:
        print(f"Generating PDF at: {pdf_path}")
        pdfkit.from_string(html_content, pdf_path, configuration=config)
        
        # Check if file exists
        if not os.path.exists(pdf_path):
            print("ERROR: PDF file was not created successfully")
            raise HTTPException(status_code=500, detail="PDF file was not created successfully")
            
        print(f"PDF generated successfully at: {pdf_path}")
            
        # Return the file with appropriate headers
        headers = {
            "Content-Disposition": f"attachment; filename=Interview_Report_{session_id}.pdf",
            "Access-Control-Expose-Headers": "Content-Disposition",
        }
        
        return FileResponse(
            path=pdf_path, 
            media_type="application/pdf", 
            filename=f"Interview_Report_{session_id}.pdf",
            headers=headers
        )
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {str(e)}")

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
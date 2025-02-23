import React from 'react'

function Footer() {
  return (
    <div className='flex h-1/4 gap-4 justify-around px-4 pt-8 pb-8'>
      <div className='flex flex-col gap-2'>
        <div className='font-bold text-xl'>Menu</div>
        <div>Home</div>
        <div>How it Works</div>
        <div>Blog</div>
        
      </div>
      <div className='flex flex-col gap-2'>
        <div  className='font-bold text-xl'>Website For</div>
        <div>Universities</div>
        <div>Career Guidance</div>
        <div>Contact Us</div>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='font-bold text-xl'>Policies</div>
        <div>Cookies Policy</div>
        <div>Privacy Policy</div>
        <div>Terms and Conditions</div>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='font-bold text-xl'>Resources</div>
        <div>How to prepare for Interviews</div>
      </div>
      <div className='flex flex-col gap-2'>
        <div>Logo</div>
        <div className='flex justify-between gap-2'>
          <a target = "_blank" href="https://www.linkedin.com">
          <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/linkedin.png" alt="linkedin"/></a>
          <a target = "_blank" href="https://www.x.com">
          <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/twitterx--v1.png" alt="twitterx--v1"/></a>
          <a target = "_blank" href="https://www.instagram.com">
          <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/instagram-new--v1.png" alt="instagram-new--v1"/></a>
        </div>
        <div>See Pricing Plans</div>
        <div>Talk to sales</div>
        <div>Join our Community</div>
      </div>
    </div>
  )
}

export default Footer
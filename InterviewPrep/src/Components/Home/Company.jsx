import { motion } from "framer-motion";

const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/8/85/Intel_logo_2023.svg" },
    { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
  ];
  

const Company = () => {
  return (
    <div className="overflow-hidden bg-[#E6E5FF] relative max-w-[2000px] mx-auto pt-[160px] pb-[160px] py-4">
        <motion.h2 className="mx-auto text-center max-w-[840px] min-w-[300px] leading-[1.3] tracking-[0.17px] mb-15 font-poppins text-[#040348]" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
          Product Name has helped countless candidates land jobs at their dream companies
        </motion.h2>
      
        <div className="relative flex whitespace-nowrap">
          <motion.div className="flex space-x-10 text-white text-lg font-semibold" animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }}>
            {companies.concat(companies).map((company, index) => (
              <motion.img key={index} src={company.logo} alt={company.name} className="h-10 mx-5" whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}/>
            ))}
          </motion.div>
      </div>
    </div>
  );
};

export default Company;

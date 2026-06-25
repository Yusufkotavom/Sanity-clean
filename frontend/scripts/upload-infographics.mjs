import { createSanityWriteClient } from "./lib/sanity-page-guards.mjs";
import fs from "fs";

async function run() {
  const client = await createSanityWriteClient();

  const files = [
    { file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/software_install_promo_1782391709188.jpg", alt: "Jasa Install Software Promo" },
    { file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/software_install_support_1782391719992.jpg", alt: "Jasa Install Software Support" },
    { file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/os_installation_logos_1782391730596.jpg", alt: "Jasa Instalasi OS Logos" },
    { file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/os_installation_setup_1782391741754.jpg", alt: "Jasa Instalasi OS Setup" },
    { file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/custom_website_dev_1782391752469.jpg", alt: "Custom Website Development" },
    { file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/website_dev_process_1782391764785.jpg", alt: "Website Development Process" },
    { file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/software_dev_isometric_1782391774196.jpg", alt: "Software Development Factory" },
    { file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/software_dev_dashboard_1782391785157.jpg", alt: "Software Development Dashboard" },
    { file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/ai_integration_brain_1782391796414.jpg", alt: "AI Integration Brain" },
    { file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/ai_integration_workflow_1782391808861.jpg", alt: "AI Integration Workflow" },
  ];

  for (const { file, alt } of files) {
    if (!fs.existsSync(file)) {
      console.log(`❌ File not found: ${file}`);
      continue;
    }
    console.log(`Uploading ${file}...`);
    try {
      const asset = await client.assets.upload('image', fs.createReadStream(file), { 
        filename: alt + '.jpg',
        title: alt
      });
      console.log(`✅ Uploaded as ${asset._id}`);
    } catch (err) {
      console.error(`❌ Failed to upload ${file}:`, err.message);
    }
  }
}

run().catch(console.error);

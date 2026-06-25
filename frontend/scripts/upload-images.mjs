import { createSanityWriteClient } from "./lib/sanity-page-guards.mjs";
import fs from "fs";

async function run() {
  const client = await createSanityWriteClient();

  const uploads = [
    {
      file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/devk_hero_banner_1782385027161.jpg",
      pageSlug: "home", // We'll find the document by slug
      alt: "DevK Studio Hero Banner",
      blockKey: "hero-home", // or we just find the hero-1 block
    },
    {
      file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/about_us_hero_1782389476964.jpg",
      pageSlug: "about",
      alt: "Creative modern IT agency workspace",
      blockKey: "hero-about",
    },
    {
      file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/software_dev_hero_1782389434552.jpg",
      pageSlug: "software",
      alt: "Software development coding on a laptop",
      blockKey: "hero-sd",
    },
    {
      file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/os_install_hero_1782389453530.jpg",
      pageSlug: "os-installation",
      alt: "Installing operating system",
      blockKey: "hero-os",
    },
    {
      file: "/home/kotacom/.gemini/antigravity-cli/brain/ced424ff-1240-486d-b423-4bd081cae1cb/bug_fix_hero_1782389465713.jpg",
      pageSlug: "bug-fixes",
      alt: "Debugging server code",
      blockKey: "hero-bug",
    },
  ];

  for (const upload of uploads) {
    if (!fs.existsSync(upload.file)) {
      console.log(`❌ File not found: ${upload.file}`);
      continue;
    }

    console.log(`Uploading ${upload.file}...`);
    const asset = await client.assets.upload('image', fs.createReadStream(upload.file), { filename: upload.alt + '.jpg' });
    console.log(`✅ Uploaded as ${asset._id}`);

    // find document by slug
    let query = `*[_type == "page" && slug.current == "${upload.pageSlug}"][0]`;
    if (upload.pageSlug === "home") {
        query = `*[_type == "page" && (slug.current == "home" || slug.current == "/" || slug.current == "index")][0]`;
    }
    const doc = await client.fetch(query);
    if (!doc) {
      console.log(`❌ Document with slug ${upload.pageSlug} not found.`);
      continue;
    }

    let targetBlockKey = upload.blockKey;
    const blockIndex = doc.blocks?.findIndex(b => b._type === "hero-1" || b._type === "hero-2");
    
    if (blockIndex === -1 || blockIndex === undefined) {
        console.log(`❌ Hero block not found in document ${doc._id}`);
        continue;
    }
    
    targetBlockKey = doc.blocks[blockIndex]._key;

    console.log(`Patching document ${doc._id}, block ${targetBlockKey}...`);
    await client
      .patch(doc._id)
      .set({
        [`blocks[${blockIndex}].image`]: {
          _type: "image",
          alt: upload.alt,
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        },
      })
      .commit();
    console.log(`✅ Patched document ${doc._id}`);
  }
}

run().catch(console.error);

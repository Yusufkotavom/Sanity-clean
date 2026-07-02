const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      if (file.endsWith('.ts')) {
        filelist.push(dir + '/' + file);
      }
    }
  });
  return filelist;
};

const blockFiles = walkSync('studio/schemas/blocks', []);

const layoutStyleFields = [
  "colorVariant", "backgroundWidth", "sectionWidth", "stackAlign", 
  "useCard", "imagePosition", "cardTheme", "cardStyle", "textAlign", 
  "blockStyles", "columns", "columnsMd", "columnsLg", "desktopGrid", 
  "mobileGrid", "cardType", "align", "imageScale", "gap", "padding", 
  "layout", "style", "variant", "theme"
];

for (const file of blockFiles) {
  if (file.includes('shared/')) continue;

  let content = fs.readFileSync(file, 'utf8');

  // Skip if it doesn't have defineType
  if (!content.includes('defineType')) continue;

  // Ensure groups exist
  if (!content.includes('groups: [')) {
    // Insert groups right before fields: [
    const groupsStr = `  groups: [\n    { name: "content", title: "Content" },\n    { name: "style", title: "Style & Layout" },\n  ],\n  fields: [`;
    content = content.replace(/fields:\s*\[/, groupsStr);
  } else {
    // Replace existing groups
    content = content.replace(/groups:\s*\[[\s\S]*?\],/, `groups: [\n    { name: "content", title: "Content" },\n    { name: "style", title: "Style & Layout" },\n  ],`);
  }

  // Iterate over defineField blocks to add/update groups
  // We'll use a regex replacement with a function
  content = content.replace(/defineField\(\{([\s\S]*?)\}\)/g, (match, fieldContent) => {
    // Extract the name of the field
    const nameMatch = fieldContent.match(/name:\s*['"](.*?)['"]/);
    if (!nameMatch) return match;
    const name = nameMatch[1];

    let group = 'content';
    if (layoutStyleFields.includes(name)) {
      group = 'style';
    }

    // if field already has a group, replace it
    if (/group:\s*['"].*?['"]/.test(fieldContent)) {
      fieldContent = fieldContent.replace(/group:\s*['"].*?['"]/, `group: "${group}"`);
    } else {
      // insert group after name
      fieldContent = fieldContent.replace(/name:\s*['"](.*?)['"],/, `name: "$1",\n      group: "${group}",`);
    }

    return `defineField({${fieldContent}})`;
  });

  fs.writeFileSync(file, content, 'utf8');
}

console.log('Done refactoring groups!');

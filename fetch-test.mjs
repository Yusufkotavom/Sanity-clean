import { createClient } from '@sanity/client';
const client = createClient({
  projectId: 'wdg7s43w',
  dataset: 'development',
  apiVersion: '2026-04-21',
  useCdn: false
});
client.fetch('*[_type == "post" && slug.current == "test-all-blocks-full-data-final"][0]{ body }').then(res => console.log(JSON.stringify(res.body.filter(b => b._type === "reviews-block"), null, 2))).catch(console.error);

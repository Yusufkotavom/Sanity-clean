const shortcode = '[block:reviews-block title="Review Spesifik Layanan" reviews="Budi Setiawan::CEO PT Maju Bersama::5::Hasil kerjanya sangat rapi dan cepat. Tim developer Kotacom luar biasa komunikatif.::2026-06-01::Google Review::https://google.com|Siti Aminah::Marketing Manager::4::Sangat puas dengan desain UI/UX nya. Tapi untuk instalasi server sedikit molor dari jadwal.::2026-05-15::Clutch::https://clutch.co" colorVariant="background" padding="top-10 bottom-10" /]';

const match = shortcode.match(/\[block:([\w-]+)(.*?)\]/);
const attrsStr = match[2];
const attrs = {};
const attrRegex = /(\w+)="([^"]*)"/g;
let attrMatch;
while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
  attrs[attrMatch[1]] = attrMatch[2];
}
console.log(attrs);

import fs from 'fs';
const file = 'c:/Users/pedro/OneDrive/Github/Sueste/src/pages/servicos.astro';
let d = fs.readFileSync(file, 'utf8');

// Replace image
d = d.replace('photo-1611162618071-b39a2b05523e', 'photo-1616469829581-73993eb86b02');

// Remove animation
const animStr =     // Bento Stagger re-added - removing opacity to ensure absolute visibility\n    gsap.from(bentoItems, {\n      y: 40,\n      stagger: 0.1,\n      duration: 1,\n      ease: "power4.out",\n      scrollTrigger: {\n        trigger: section,\n        start: "top 85%",\n      },\n    });;

const animStrWin =     // Bento Stagger re-added - removing opacity to ensure absolute visibility\r\n    gsap.from(bentoItems, {\r\n      y: 40,\r\n      stagger: 0.1,\r\n      duration: 1,\r\n      ease: "power4.out",\r\n      scrollTrigger: {\r\n        trigger: section,\r\n        start: "top 85%",\r\n      },\r\n    });;

d = d.replace(animStr, '    // Bento Stagger animation removed.');
d = d.replace(animStrWin, '    // Bento Stagger animation removed.');

fs.writeFileSync(file, d);
console.log('Done!');

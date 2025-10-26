
//Interactive animated background particles + mouse interaction
   
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

const particles = [];
const maxParticles = Math.floor((W*H)/50000); // scale with screen

function rand(min, max){ return Math.random()*(max-min)+min }

class Particle {
  constructor(x,y, r=rand(1,3)){
    this.x = x;
    this.y = y;
    this.vx = rand(-0.3,0.3);
    this.vy = rand(-0.5,0.5);
    this.r = r;
    this.hueShift = rand(0,360);
    this.alpha = rand(0.35,0.9);
  }
  update(){
    this.x += this.vx;
    this.y += this.vy;
    // wrap edges
    if(this.x < -50) this.x = W + 50;
    if(this.x > W + 50) this.x = -50;
    if(this.y < -50) this.y = H + 50;
    if(this.y > H + 50) this.y = -50;
  }
  draw(){
    // color mixes cyan/violet gradient subtly
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r*8);
    g.addColorStop(0, `rgba(0,229,255,${this.alpha})`);   // cyan
    g.addColorStop(0.5, `rgba(124,58,237,${this.alpha*0.6})`); // violet
    g.addColorStop(1, `rgba(10,10,35,0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r*4, 0, Math.PI*2);
    ctx.fill();
  }
}

/* init */
function initParticles(){
  particles.length = 0;
  const base = Math.max(20, maxParticles);
  for(let i=0;i<base;i++){
    particles.push(new Particle(rand(0,W), rand(0,H), rand(0.6,2.5)));
  }
}
initParticles();

/* animation loop */
function loop(){
  ctx.clearRect(0,0,W,H);
  // subtle background overlay (depth)
  ctx.fillStyle = 'rgba(6,8,20,0.32)';
  ctx.fillRect(0,0,W,H);

  // draw particles
  for(let p of particles){
    p.update();
    p.draw();
  }

  requestAnimationFrame(loop);
}
loop();

/* resize handling */
window.addEventListener('resize', ()=>{
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initParticles();
});



/* click */
window.addEventListener('click', (e)=>{
  for(let i=0;i<18;i++){
    const p = new Particle(e.clientX, e.clientY, rand(0.7,2.6));
    const angle = Math.random()*Math.PI*2;
    const speed = rand(1.2,3.2);
    p.vx = Math.cos(angle)*speed;
    p.vy = Math.sin(angle)*speed;
    p.alpha = 0.9;
    particles.push(p);
  }
});


//Project details toggle handlers
   
document.querySelectorAll('.toggle-details').forEach(btn=>{
  btn.addEventListener('click', (ev)=>{
    const card = ev.target.closest('.project-card');
    const details = card.querySelector('.project-details');
    if(!details) return;
    const open = !details.hasAttribute('hidden');
    if(open){
      details.hidden = true;
      ev.target.textContent = 'Details';
    } else {
      details.hidden = false;
      ev.target.textContent = 'Close';
      // smooth scroll the card into view (mobile-friendly)
      card.scrollIntoView({behavior:'smooth', block:'center'});
    }
  });
});


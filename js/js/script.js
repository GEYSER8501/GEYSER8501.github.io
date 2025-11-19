document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const delay = Math.random()*0.5;
        setTimeout(()=>{entry.target.classList.add('show');}, delay*1000);
      }
    });
  }, {threshold:0.2});
  cards.forEach(card => observer.observe(card));

  // Header WOW con partículas 3D fuego
  const canvas = document.getElementById('wowParticles');
  const ctx = canvas.getContext('2d');
  const header = document.querySelector('header');
  let w,h;
  function resizeCanvas(){w=canvas.width=header.offsetWidth; h=canvas.height=header.offsetHeight;}
  window.addEventListener('resize',resizeCanvas); resizeCanvas();

  const particles=[];
  for(let i=0;i<200;i++){
    particles.push({
      x:Math.random()*w,
      y:Math.random()*h,
      z:Math.random()*100, // profundidad
      r:Math.random()*3+1,
      dx:(Math.random()-0.5)*3,
      dy:(Math.random()-0.5)*3,
      dz:(Math.random()-0.5)*1,
      color:`hsl(${Math.random()*60},100%,50%)`
    });
  }

  function animateParticles(){
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      // efecto 3D
      const scale = 1 + (p.z/100);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r*scale,0,Math.PI*2);
      ctx.fillStyle=p.color;
      ctx.fill();
      p.x += p.dx; p.y += p.dy; p.z += p.dz;
      p.r = 1 + Math.abs(Math.sin(Date.now()*0.003 + p.x))*3;
      if(p.x<0||p.x>w)p.dx*=-1;
      if(p.y<0||p.y>h)p.dy*=-1;
      if(p.z<0||p.z>100)p.dz*=-1;
      // Rebotar entre tarjetas
      cards.forEach(card=>{
        const rect=card.getBoundingClientRect();
        if(p.x>rect.left && p.x<rect.right && p.y>rect.top && p.y<rect.bottom){
          p.dx*=-1; p.dy*=-1; p.dz*=-1;
        }
      });
    }
    // líneas conectando sparkles cercanos
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const p1=particles[i], p2=particles[j];
        const dist=Math.hypot(p1.x-p2.x,p1.y-p2.y);
        if(dist<60){
          ctx.beginPath();
          ctx.moveTo(p1.x,p1.y);
          ctx.lineTo(p2.x,p2.y);
          ctx.strokeStyle='rgba(255,220,100,'+(1-dist/60)+')';
          ctx.lineWidth=0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Sparkles mouse
  cards.forEach(card=>{
    card.addEventListener('mousemove', e=>{
      for(let i=0;i<6;i++){
        const sparkle=document.createElement('div');
        sparkle.className='sparkle';
        sparkle.style.top=`${e.offsetY+Math.random()*30-15}px`;
        sparkle.style.left=`${e.offsetX+Math.random()*30-15}px`;
        sparkle.style.background=`hsl(${Math.random()*60},100%,80%)`;
        card.appendChild(sparkle);
        setTimeout(()=>{sparkle.remove();},700);
      }
    });
  });

  // Parallax avanzado tarjetas
  window.addEventListener('scroll',()=>{
    const scrollTop=window.scrollY;
    cards.forEach((card,i)=>{
      const speed=0.06 + Math.random()*0.04;
      card.style.transform=`translateY(${scrollTop*speed}px) scale(1) rotateX(${Math.sin(scrollTop*0.002+i)*2}deg) rotateY(${Math.cos(scrollTop*0.002+i)*2}deg)`;
    });
  });
});

let data = {
  coches: [],
  clientes: [],
  historial: [],
  caja: 0,
  abierta: false
};

// CREAR COCHES
data.coches = [
  "Drift 1","Drift 2",
  ...Array.from({length:10},(_,i)=>"Futbol "+(i+1)),
  ...Array.from({length:6},(_,i)=>"Robot "+(i+1)),
  ...Array.from({length:10},(_,i)=>"Peleador "+(i+1))
].map(n=>({
  nombre:n,
  tiempo:0,
  estado:"libre",
  cliente:""
}));

// VISTAS
function vista(v){
  document.querySelectorAll("#inicio,#clientes,#historial")
    .forEach(e=>e.classList.remove("show"));

  const el = document.getElementById(v);
  if(el) el.classList.add("show");

  if(v==="clientes") verClientes();
  if(v==="historial") verHistorial();
}

// RENDER
function render(){
  const cont=document.getElementById("coches");
  if(!cont) return;

  cont.innerHTML="";

  const tipos = ["Drift","Futbol","Robot","Peleador"];

  tipos.forEach(tipo=>{
    const seccion=document.createElement("div");

    const titulo=document.createElement("h2");
    titulo.innerText=tipo;
    seccion.appendChild(titulo);

    const grid=document.createElement("div");
    grid.className="grid";

    data.coches
      .filter(c=>c.nombre.toLowerCase().includes(tipo.toLowerCase()))
      .forEach(c=>{
        const i = data.coches.findIndex(x=>x.nombre===c.nombre);

        let clase="libre";
        if(c.estado==="uso" && c.tiempo>5) clase="activo";
        else if(c.estado==="uso" && c.tiempo>0 && c.tiempo<=5) clase="poco";
        else if(c.estado==="uso" && c.tiempo===0) clase="terminado";

        const div=document.createElement("div");
        div.className="coche "+clase;

        div.innerHTML=`
          <b>${c.nombre}</b><br>
          ${c.cliente || ""}<br>
          ${c.tiempo>0 ? c.tiempo+" min":""}<br>
          ${
            c.estado==="uso"
            ? `<button onclick="terminar(${i})">✔</button>`
            : `<button onclick="iniciar(${i})">▶</button>`
          }
        `;

        grid.appendChild(div);
      });

    seccion.appendChild(grid);
    cont.appendChild(seccion);
  });

  document.getElementById("dinero").innerText="$"+data.caja;
}

// INICIAR
function iniciar(i){
  if(!data.abierta){
    alert("Abre caja primero");
    return;
  }

  const nombre=prompt("Nombre");
  const tiempo=Number(prompt("Minutos"));

  if(!nombre || !tiempo) return;

  const c=data.coches[i];
  c.estado="uso";
  c.cliente=nombre;
  c.tiempo=tiempo;

  data.clientes.push({
    nombre,
    coche:c.nombre,
    hora:new Date().toLocaleTimeString()
  });

  render();
}

// TERMINAR
function terminar(i){
  const c=data.coches[i];

  data.caja += Math.ceil(c.tiempo/15)*50;

  c.estado="libre";
  c.tiempo=0;
  c.cliente="";

  render();
}

// TIMER
setInterval(()=>{
  data.coches.forEach(c=>{
    if(c.estado==="uso" && c.tiempo>0){
      c.tiempo--;
    }
  });
  render();
},60000);

// CAJA
function abrirCaja(){
  if(data.abierta){
    alert("Ya abierta");
    return;
  }

  const monto=Number(prompt("Monto inicial"));
  if(!monto) return;

  data.caja=monto;
  data.abierta=true;
  render();
}

function cerrarCaja(){
  if(!data.abierta) return;
  if(!confirm("Cerrar caja?")) return;

  data.historial.push({
    fecha:new Date().toLocaleDateString(),
    hora:new Date().toLocaleTimeString(),
    total:data.caja,
    clientes:[...data.clientes]
  });

  data.caja=0;
  data.abierta=false;
  data.clientes=[];

  render();
  verHistorial();
}

// CLIENTES
function verClientes(){
  const cont=document.getElementById("listaClientes");
  if(!cont) return;

  cont.innerHTML="";

  data.clientes.forEach(c=>{
    const div=document.createElement("div");
    div.innerText=`${c.nombre} | ${c.coche} | ${c.hora}`;
    cont.appendChild(div);
  });
}

// HISTORIAL
function verHistorial(){
  const cont=document.getElementById("listaHistorial");
  if(!cont) return;

  cont.innerHTML="";

  data.historial.forEach(d=>{
    const div=document.createElement("div");
    div.className="card";

    div.innerHTML=`
      📅 ${d.fecha} ${d.hora}<br>
      💰 Total: $${d.total}<br>
      👥 Clientes: ${d.clientes.length}
    `;

    cont.appendChild(div);
  });
}

// INIT
window.onload=()=>{
  vista("inicio");
  render();
};

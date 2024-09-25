document.addEventListener("DOMContentLoaded", () => {
    rellenarSelect();
    document.getElementById("formulario").addEventListener("submit", async (e) => {
        e.preventDefault();
        peticionFinal();
    })
})

function peticionFinal() {
    const departamento = document.getElementById("selectDepartamentos").value;
    const localizacion = document.getElementById("localizacion").value;
    const palabraClave = document.getElementById("palabraClave").value;
    const localizacionParseada = localizacion.charAt(0).toUpperCase() + localizacion.slice(1);
    filtradoTotal(localizacionParseada, palabraClave, departamento).then(lista => renderizarCards(lista));
}

async function filtradoTotal(localizacion, palabra, departamento) {
    const respuesta = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${localizacion}&q=${palabra}&departmentId=${departamento}`)
    const lista = await respuesta.json();
    return lista;
}


function rellenarSelect() {
    fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments")
        .then(respuesta => respuesta.json())
        .then(listaDepartamentos => rellenarDepartamentos(listaDepartamentos));
}

function rellenarDepartamentos(lista) {
    const select = document.getElementById("selectDepartamentos");
    const optionVacia = document.createElement("option");
    optionVacia.value = "";
    optionVacia.textContent = "N/A";
    select.appendChild(optionVacia);
    lista.departments.forEach(a => {
        const option = document.createElement("option");
        option.value = a.departmentId;
        option.textContent = a.displayName;
        select.appendChild(option);
    });
}

function renderizarCards(lista) {
    const contenedor = document.getElementById("contenedorTarjetas");
    lista.objectIDs.forEach(a => {
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${a}`)
            .then(respuesta => respuesta.json())
            .then(obj => contenedor.appendChild(rellenarCard(obj)));
    })
}

function rellenarCard(obj) {
    const tarjeta = document.createElement("section");
    tarjeta.className = "card";
    const imagen = document.createElement("img");
    imagen.className = "imagen"
    if (obj.primaryImage === "") {
        imagen.src = "https://previews.123rf.com/images/yoginta/yoginta2301/yoginta230100567/196853824-imagen-no-encontrada-ilustraci%C3%B3n-vectorial.jpg";
    } else {
        imagen.src = obj.primaryImage;
    }
    const titulo = document.createElement("p");
    titulo.textContent = `TITULO : ${obj.title}`;
    const cultura = document.createElement("p");
    cultura.textContent = `CULTURA : ${obj.culture}`;
    tarjeta.appendChild(imagen);
    tarjeta.appendChild(titulo);
    tarjeta.appendChild(cultura);
    if (obj.dynasty) {
        const dinastia = document.createElement("p");
        dinastia.textContent = `DINASTIA: ${obj.dynasty}`;
        tarjeta.appendChild(dinastia);
    }
    if(obj.additionalImages.length > 0){
        console.log("ola")
        console.log(obj.objectID)
    }
    return tarjeta;
}


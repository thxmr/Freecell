document.addEventListener("DOMContentLoaded", () => {

    let plateau = new Plateau(document.getElementById("plateau"));

    let zones = [];

    let cartesVides = document.querySelectorAll("div.carte.vide");
    cartesVides.forEach(c => {
        let ctrl = new CarteVide(c);
        zones.push(c);
    });



    // on récupère le <template>
    let carteTemplate = document.querySelector("#modeleCarte") ;
    // on récupère le DocumentFragment
    let docFrag = document.importNode(carteTemplate.content, true) ;
    // on récupère la première div (de classe
    // « carte cachée » du DocumentFragment
    let nouvelleCarte = docFrag.querySelector("div.carte");

    let listeCartes = [];
    for(let i = 1; i < 10; i++) {
        listeCartes.push({valeur:i,couleur:"rouge"});
        listeCartes.push({valeur:i,couleur:"noir"});
    }


    let cptZone = 0;
    listeCartes.forEach(c => {
        let carteHtml = nouvelleCarte.cloneNode(true);
        console.dir(c.couleur);
        carteHtml.classList.toggle(c.couleur);
        carteHtml.id = c.couleur+c.valeur;
        carteHtml.innerHTML = c.valeur;


        let monStyle = getComputedStyle(zones[cptZone]);
        let bord = parseInt(monStyle["border-left-width"])+1 ; // +1 pour l'ombre. on pourrait le calculer en analysant monStyle["box-shadow"]...
        carteHtml.style.left="-"+bord+"px";
        carteHtml.style.top=""+Carte.ESPACEMENT+"px";

        let zindex = parseInt(monStyle["z-index"]);
        carteHtml.style.zIndex = zindex+1;

        let ctrl = new Carte(carteHtml,c.valeur, c.couleur);

        // plateau.plateauHtml.appendChild(carteHtml);
        zones[cptZone].appendChild(carteHtml);
        zones[cptZone] = carteHtml;
        cptZone = (cptZone+1)%zones.length;

    });


});
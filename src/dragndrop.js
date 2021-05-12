class Plateau {
    constructor(eltHtml) {
        this.plateauHtml = eltHtml;

        this.plateauHtml.addEventListener("dragover", ( event ) => {
            // prevent default to allow drop
            event.preventDefault();
            console.log("dragover sur plateau");
        });

        this.plateauHtml.addEventListener("drop", (e) => this.dropUneCarte(e));

    }

    dropUneCarte(event) {
        let carteDéplacée = document.getElementById(event.dataTransfer.getData("text/id"));
        carteDéplacée.ctrl.memoriserAnciennePosition();

        //  calcul de la nouvelle position : à partir des coordonnées de l'évenement (par rapport à l'onglet qui affiche la page)
        // moins la position du plateau par rapport à l'onglet : pour placer la carte dans le plateau
        // et moins la position initial de la souris sur la carte, pour ne pas déplacer la carte (son coin en haut à gauche) sous la souris
        let positionDuPlateau = this.plateauHtml.getBoundingClientRect(); // position du plateau par rapport à l'onglet 
        let xInit = parseInt(event.dataTransfer.getData("text/posX"));    // position initial de la souris
        let yInit = parseInt(event.dataTransfer.getData("text/posY"));
        let x = event.clientX - positionDuPlateau.x - xInit;              // calcul
        let y = event.clientY - positionDuPlateau.y - yInit;

        carteDéplacée.style.left=""+x+"px";
        carteDéplacée.style.top=""+y+"px";


        this.plateauHtml.appendChild(carteDéplacée);

    }

}



class Carte {

    static ESPACEMENT = 20; //px


    constructor(eltHtml, valeur, couleur) {
       this.carteHtml = eltHtml;
       this.valeur = valeur;
       this.couleur = couleur;

       this.carteHtml.ctrl = this;


       this.carteHtml.addEventListener("dragstart", (e) => this.drag(e));
       this.carteHtml.addEventListener("dragover", ( event ) => {
           // prevent default to allow drop
           event.preventDefault();
           event.stopPropagation();
           console.log("drag over sur "+this.carteHtml.id);     //TODO A retirer
       });
       this.carteHtml.addEventListener("drop", (e) => this.dropUneAutreCarte(e));

        if (this.valeur > 0) {
            // creation de la minature
            let span = document.createElement("span");
            span.innerHTML = ""+valeur;
            span.className = couleur;
            this.carteHtml.appendChild(span);
        }      
    }


    /**
     * ébauche pour permettre une (et une seule) annulation de déplacement
     * cela va avec restaurer()
     */
    memoriserAnciennePosition() {
        let monStyle = getComputedStyle(this.carteHtml);
        let gauche = parseInt(monStyle["left"]);
        let haut = parseInt(monStyle["top"]);


        this.ancienGauche = gauche;
        this.ancientHaut = haut;
        this.ancienParent = this.carteHtml.parentNode;
    }

    restaurer() {
        this.carteHtml.style.left=""+this.ancienGauche+"px";
        this.carteHtml.style.top=""+this.ancientHaut+"px";
        this.ancienParent.appendChild(this.carteHtml);
    }

    drag(e) {
        e.stopPropagation(); // pour ne pas que le plateau traite aussi l'événement

        e.dataTransfer.setData("text/id", this.carteHtml.id);
        
        // position de la souris sur la carte
        // calcul car rien de standard
        let positionDeLaCarte = this.carteHtml.getBoundingClientRect();
        let x = e.clientX - positionDeLaCarte.x; // layerX n'est pas standard, on calcul
        let y = e.clientY - positionDeLaCarte.y;
        e.dataTransfer.setData("text/posX", x);
        e.dataTransfer.setData("text/posY", y);

    }

    dropUneAutreCarte(e) {
        e.stopPropagation();  // pour ne pas que le plateau traite aussi l'événement

        console.log("drop sur "+this.carteHtml.id+" de "+e.dataTransfer.getData("text/id"));
        let carteDéplacée = document.getElementById(e.dataTransfer.getData("text/id"));
        // console.log("drop possible ? "+this.peutRecevoir(carteDéplacée.ctrl));
        
        if (this.peutRecevoir(carteDéplacée.ctrl)) {
            carteDéplacée.ctrl.memoriserAnciennePosition();
            console.log("déplacement possible");
            let monStyle = getComputedStyle(this.carteHtml);
            
            /*
            changement du calcul : ce n'est plus par rapport au document / à l'onglet, car la carte va être déplacée dans l'autre carte
            let gauche = parseInt(monStyle["left"]);
            carteDéplacée.style.left=""+gauche+"px";
            let haut = parseInt(monStyle["top"]);
            carteDéplacée.style.top=""+(haut+Carte.ESPACEMENT)+"px";
            */

            

            let bord = parseInt(monStyle["border-left-width"])+1 ; // +1 pour l'ombre. on pourrait le calculer en analysant monStyle["box-shadow"]...
            carteDéplacée.style.left="-"+bord+"px";
            carteDéplacée.style.top=""+Carte.ESPACEMENT+"px";
            
            let zindex = parseInt(monStyle["z-index"]);
            carteDéplacée.style.zIndex = zindex+1;

            this.carteHtml.appendChild(carteDéplacée);
            

        } else {
            console.log("déplacement impossible");      //TODO Changer le console log en son "erreur"
        }
    
    }


    peutRecevoir(carte) {
        return ((this.couleur !== carte.couleur) && (this.valeur === carte.valeur+1))
    }
}




class CarteVide extends Carte {
    constructor(eltHtml){
        super(eltHtml, -1, "aucune");
    }

    peutRecevoir(carte) {
        return true; // il faudrait vérifier que la carte n'a pas encore de carte à l'intérieur.
    }
}

// function setLanguage(lang) {
//   localStorage.setItem("preferredLanguage", lang);
//   fetch("./assets/translations.json")
//     .then(response => response.json())
//     .then(data => {
//       document.querySelectorAll("[data-i18n]").forEach(el => {
//         const key = el.getAttribute("data-i18n");
//         if (data[lang][key]) {
//           el.textContent = data[lang][key];
//         }
//       });
//     })
//     .catch(error => console.error("Erreur de chargement des traductions:", error));
// }

function setLanguage(lang) {
  localStorage.setItem("preferredLanguage", lang);
  fetch("./assets/translations.json")
    .then(response => response.json())
    .then(data => {
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (data[lang][key]) {
          el.textContent = data[lang][key];
        }
      });
    })
    .catch(error => console.error("Erreur de chargement des traductions:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("preferredLanguage") || "fr"; // langue par défaut = français
  setLanguage(savedLang);
});

function setLanguage(lang) {
  localStorage.setItem("preferredLanguage", lang);
  fetch("./assets/translations.json")
    .then(response => response.json())
    .then(data => {
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (data[lang][key]) {
          el.textContent = data[lang][key];
        }
      });
    })
    .catch(error => console.error("Erreur de chargement des traductions:", error));
}

// ----------------------------

document.querySelector('.adhesion-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const formData = new FormData(this);

    const nomCandidat = formData.get('nom') || "Non renseigné";
    const adresseCandidat = formData.get('adresse') || "Non renseigné";
    const dateToday = new Date().toLocaleDateString('fr-FR');
    const typeAdhesion = formData.get('type_adhesion') || "Non renseigné";

    // ✅ Fonction pied de page
    function drawFooter() {
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.line(20, 275, 190, 275);
        doc.text("www.sadc-ascl.com", 20, 282);
        doc.text("Contact : +237 654 807 793", 145, 282);
    }

    // ✅ Fonction en-tête
    function drawHeader(title) {
        doc.setFillColor(128, 0, 0);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("SADC-ASCL", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text(title, 105, 30, { align: "center" });

        // ✅ Réinitialiser la couleur du texte pour le contenu
        doc.setTextColor(0, 0, 0);
    }

    // ---------------- PAGE 1 : FICHE D'ADHÉSION ----------------
    drawHeader("FICHE D'ADHÉSION");
    doc.setFontSize(10);
    doc.text(`Le : ${dateToday}`, 150, 50);

    let y = 70;
    const details = [
        ["Nom et prénoms", formData.get('nom')],
        ["Date/Lieu de naissance", formData.get('naissance')],
        ["Nationalité", formData.get('nationalite')],
        ["Profession / Fonction", formData.get('profession')],
        ["Institution", formData.get('institution')],
        ["Email", formData.get('email')],
        ["Téléphone", formData.get('telephone')],
        ["Adresse complète", formData.get('adresse')],
        ["Type d'adhésion", typeAdhesion],
        ["Motivation", formData.get('motivation')]
    ];

    details.forEach(item => {
        doc.setFont("helvetica", "bold");
        doc.text(`${item[0]} :`, 20, y);
        doc.setFont("helvetica", "normal");
        const val = item[1] ? item[1].toString() : "Non renseigné";
        const lines = doc.splitTextToSize(val, 120);
        doc.text(lines, 70, y);
        y += (lines.length * 6) + 8;
    });

    drawFooter();

    // ---------------- PAGE 2 : ENGAGEMENT ----------------
    doc.addPage();
    drawHeader("ENGAGEMENT DU DEMANDEUR");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let y2 = 60;

    const engagementText =
        `Je soussigné(e) ${nomCandidat}, déclare sur l’honneur l’exactitude des renseignements fournis dans le présent formulaire.\n\n` +
        "Je certifie avoir pris connaissance des statuts ainsi que du règlement intérieur de la Société Africaine de Droit Communautaire et m’engage solennellement à m’y conformer en toutes circonstances.\n\n" +
        "Je m’engage en outre à participer activement aux activités de la Société et à m’acquitter des droits d’adhésion et contributions annuelles tels que fixés par les organes compétents.\n\n" +
        "Pour les membres actifs : droits d’adhésion = 5.000 F CFA (7,62 €), contribution annuelle = 30 € (doctorants) ou 65 € (professionnels).\n\n" +
        "Pour les membres associés : droits d’adhésion annuels = 40.000 F CFA (61,03 €).\n\n" +
        `Fait à : ${adresseCandidat}\nLe : ${dateToday}\nSignature du demandeur : ${nomCandidat}`;

    const engagementLines = doc.splitTextToSize(engagementText, 170);
    doc.text(engagementLines, 20, y2);
    y2 += engagementLines.length * 6 + 15;

    let annexeText = "Annexe : pièces à fournir pour l’adhésion\n\n";
    if (typeAdhesion === "individuel") {
        annexeText +=
            "1. Pour les membres individuels\n" +
            "• Lettre de demande d’adhésion adressée au Président.\n" +
            "• Formulaire dûment rempli et signé.\n" +
            "• Curriculum vitae à jour.\n" +
            "• Photo d’identité récente.\n" +
            "• Preuve du paiement des frais d’adhésion.\n\n";
    } else if (typeAdhesion === "institutionnel") {
        annexeText +=
            "2. Pour les membres institutionnels\n" +
            "• Lettre officielle de demande d’adhésion signée par le représentant légal.\n" +
            "• Formulaire dûment rempli.\n" +
            "• Copie des statuts ou de l’acte constitutif.\n" +
            "• Preuve du paiement des frais d’adhésion.\n\n";
    } else {
        annexeText += "Veuillez sélectionner un type d’adhésion pour voir les pièces requises.\n\n";
    }
    annexeText += "N.B : Les dossiers doivent être transmis par voie électronique à : contact@sadc-ascl.com";

    const annexeLines = doc.splitTextToSize(annexeText, 170);
    doc.text(annexeLines, 20, y2);

    drawFooter();

    // ---------------- PAGE 3 : RÉSERVÉ AUX REPRÉSENTANTS ----------------
    doc.addPage();
    drawHeader("SECTION RÉSERVÉE AUX REPRÉSENTANTS");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let y3 = 60;

    doc.text("• Date de réception du dossier : ....................................................", 20, y3);
    y3 += 20;

    doc.text("• Dossier complet :", 20, y3);
    doc.rect(80, y3 - 4, 5, 5); doc.text("Oui", 87, y3);
    doc.rect(105, y3 - 4, 5, 5); doc.text("Non", 112, y3);
    y3 += 20;

    doc.text("• Décision :", 20, y3);
    doc.rect(55, y3 - 4, 5, 5); doc.text("Accepté", 62, y3);
    doc.rect(90, y3 - 4, 5, 5); doc.text("Rejeté", 97, y3);
    doc.rect(125, y3 - 4, 5, 5); doc.text("Ajourné", 132, y3);
    y3 += 20;

    doc.text("• Observations : .............................................................................", 20, y3);
    y3 += 20;
    doc.text("• Motivations en cas de rejet : …………………………………………………………………..", 20, y3);
    y3 += 20;
    doc.text("• Signature et cachet : ....................................................", 20, y3);

    drawFooter();

    // ✅ Sauvegarde
    doc.save(`Adhesion_SADC_${nomCandidat.replace(/\s+/g, '_')}.pdf`);
});


document.getElementById("btnSendMail").onclick = function() {
    const formData = new FormData(document.querySelector('.adhesion-form'));
    const nomCandidat = formData.get('nom') || "Candidat";
    const emailCandidat = formData.get('email') || "";

    const subject = encodeURIComponent(`Dossier d'adhésion SADC - ${nomCandidat}`);
    const body = encodeURIComponent(
        `Bonjour,\n\nJe vous adresse ma demande d'adhésion à la SADC-ASCL.\n\n` +
        `Veuillez trouver ci-joint mon formulaire PDF ainsi que mes justificatifs :\n` +
        `- CV\n- Photo d'identité\n- Copie CNI/Passeport\n- Preuve de paiement\n\n` +
        `Cordialement,\n${nomCandidat}\n${emailCandidat}`
    );

    // ✅ Redirection directe vers la messagerie
    window.location.href = `mailto:christian.nkouateba@gmail.com?subject=${subject}&body=${body}`;
};

function sendWhatsApp() {
  const nom = document.getElementById("nom").value;
  const message = document.getElementById("message").value;

  // Numéro WhatsApp institutionnel (à remplacer par le vrai numéro)
  const phoneNumber = "+237654807793";

  // Message formaté
  const text = `Nom: ${nom}\nMessage: ${message}`;

  // URL API WhatsApp
  const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;

  // Ouvre WhatsApp dans un nouvel onglet
  window.open(url, "_blank");
}

// Sélectionner tous les boutons de filtre
const filterButtons = document.querySelectorAll("[data-filter]");
// Sélectionner toutes les cartes projet
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");

    projectCards.forEach(card => {
      // Si le filtre est "all" ou correspond à la catégorie de la carte
      if (filter === "all" || card.getAttribute("data-category") === filter) {
        card.style.display = "block"; // Affiche la carte
      } else {
        card.style.display = "none"; // Masque la carte
      }
    });
  });
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Retirer la classe active de tous les boutons
    filterButtons.forEach(btn => btn.classList.remove("active-filter"));
    // Ajouter la classe active au bouton cliqué
    button.classList.add("active-filter");
  });
});

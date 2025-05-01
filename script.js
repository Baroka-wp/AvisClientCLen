document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.rating-form');
    const ratings = {
        ambiance: 0,
        nourriture: 0,
        service: 0
    };

    let currentStep = 1;
    const totalSteps = 4;

    // Gestion de la navigation entre les étapes
    function updateStep(newStep) {
        // Mettre à jour les étapes
        document.querySelectorAll('.rating-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`.rating-step[data-step="${newStep}"]`).classList.add('active');

        // Mettre à jour la barre de progression
        document.querySelectorAll('.progress-step').forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            if (stepNum === newStep) {
                step.classList.add('active');
            } else if (stepNum < newStep) {
                step.classList.add('completed');
            }
        });

        // Mettre à jour les lignes de progression
        document.querySelectorAll('.progress-line').forEach((line, index) => {
            line.classList.remove('active');
            if (index < newStep - 1) {
                line.classList.add('active');
            }
        });

        currentStep = newStep;
    }

    // Gestion des boutons de navigation
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentCriteria = document.querySelector(`.rating-step[data-step="${currentStep}"] .rating-stars`);
            if (currentCriteria) {
                const criteria = currentCriteria.dataset.criteria;
                if (ratings[criteria] === 0) {
                    alert('Veuillez donner une note avant de continuer');
                    return;
                }
            }
            if (currentStep < totalSteps) {
                updateStep(currentStep + 1);
            }
        });
    });

    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                updateStep(currentStep - 1);
            }
        });
    });

    // Gestion des étoiles pour chaque critère
    document.querySelectorAll('.rating-stars').forEach(ratingGroup => {
        const criteria = ratingGroup.dataset.criteria;
        const stars = ratingGroup.querySelectorAll('.star');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = parseInt(star.dataset.value);
                ratings[criteria] = value;

                // Animation des étoiles
                stars.forEach(s => {
                    s.classList.remove('active');
                    if (parseInt(s.dataset.value) <= value) {
                        s.classList.add('active');
                    }
                });
            });

            // Effet de survol
            star.addEventListener('mouseover', () => {
                const value = parseInt(star.dataset.value);
                stars.forEach(s => {
                    if (parseInt(s.dataset.value) <= value) {
                        s.style.transform = 'scale(1.1)';
                    }
                });
            });

            star.addEventListener('mouseout', () => {
                stars.forEach(s => {
                    s.style.transform = '';
                });
            });
        });
    });

    // Gestion du modal
    const modal = document.getElementById('thankYouModal');
    const closeModalBtn = modal.querySelector('.modal-close-btn');

    function showModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', hideModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            hideModal();
        }
    });

    // Gestion du formulaire
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (ratings.ambiance === 0 || ratings.nourriture === 0 || ratings.service === 0) {
            alert('Veuillez noter tous les critères avant de soumettre votre avis');
            return;
        }

        // Réinitialiser le formulaire
        form.reset();
        document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
        Object.keys(ratings).forEach(key => ratings[key] = 0);
        updateStep(1);

        // Afficher le modal de remerciement
        showModal();
    });
}); 
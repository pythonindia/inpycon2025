document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.schedule-card');
    const contents = document.querySelectorAll('.schedule-content');
    let selectedCard = null;

    // Function to reset all card backgrounds
    const resetCardBackgrounds = () => {
        cards.forEach(card => {
            const highlightDiv = card.querySelector('.card-grid');
            highlightDiv.classList.remove('pycon-bg-lime');
            highlightDiv.style.backgroundColor = '#FFFFFF';
        });
    };

    // Function to hide all schedules
    const hideAllSchedules = () => {
        contents.forEach(content => content.classList.add('hidden'));
    };

    // Initial state: Highlight the first card and show the first schedule
    if (cards.length > 0 && contents.length > 0) {
        selectedCard = cards[0];
        const firstContentId = selectedCard.getAttribute('data-schedule');

        // Highlight the first card
        const firstHighlightDiv = selectedCard.querySelector('.card-grid');
        firstHighlightDiv.classList.add('bg:pycon-bg-lime');
        firstHighlightDiv.style.backgroundColor = '#CDFF89';

        // Show the first schedule
        document.getElementById(firstContentId).classList.remove('hidden');
    }

    // Add event listeners to all cards
    cards.forEach(card => {
        const highlightDiv = card.querySelector('.card-grid');

        card.addEventListener('click', () => {
            // Reset previous selection
            resetCardBackgrounds();
            hideAllSchedules();

            // Highlight the clicked card
            highlightDiv.classList.add('pycon-bg-lime');
            highlightDiv.style.backgroundColor = '#CDFF89'; // Lime background

            // Show the corresponding schedule
            const scheduleId = card.getAttribute('data-schedule');
            document.getElementById(scheduleId).classList.remove('hidden');

            // Update the selected card
            selectedCard = card;
        });

        // Handle hover for unselected cards
        card.addEventListener('mouseenter', () => {
            if (card !== selectedCard) {
                highlightDiv.style.backgroundColor = '#CDFF89'; // Hover lime background
            }
        });

        card.addEventListener('mouseleave', () => {
            if (card !== selectedCard) {
                highlightDiv.style.backgroundColor = '#FFFFFF'; // Default white background
            }
        });
    });
});


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

    const highlight = (card) => {
        const div = card.querySelector('.card-grid');
        div.classList.add('pycon-bg-lime');
        div.style.backgroundColor = '#CDFF89';
    };

    const setInitialState = () => {
        if (!cards.length || !contents.length) return;
        resetCardBackgrounds();
        hideAllSchedules();

        // Always show FIRST card + its content
        const firstCard = cards[2];
        const firstContentId = firstCard.getAttribute('data-schedule');

        highlight(firstCard);
        document.getElementById(firstContentId)?.classList.remove('hidden');
        selectedCard = firstCard;
    };

    // Initial load
    setInitialState();

    // If coming back via back/forward cache, reload once to reset UI to first card
    window.addEventListener('pageshow', (evt) => {
        const nav = performance.getEntriesByType('navigation')[0];
        const isBFCache = evt.persisted || (nav && nav.type === 'back_forward');

        if (isBFCache && !sessionStorage.getItem('reloadedOnce')) {
            sessionStorage.setItem('reloadedOnce', '1');
            window.location.reload();
        } else if (!isBFCache) {
            // Normal load after hard reload; clear the flag
            sessionStorage.removeItem('reloadedOnce');
        }
    });

    // Click handlers
    cards.forEach(card => {
        const highlightDiv = card.querySelector('.card-grid');

        card.addEventListener('click', () => {
            const scheduleId = card.getAttribute('data-schedule');

            resetCardBackgrounds();
            hideAllSchedules();

            highlight(card);
            document.getElementById(scheduleId)?.classList.remove('hidden');
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

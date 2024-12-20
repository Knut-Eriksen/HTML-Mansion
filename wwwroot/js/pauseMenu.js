// !!!  Convert to CSS if you have time !!!
function createPauseMenu(togglePause) {
    const pauseMenu = document.createElement('div');
    pauseMenu.style.position = 'fixed';
    pauseMenu.style.top = '50%';
    pauseMenu.style.left = '50%';
    pauseMenu.style.transform = 'translate(-50%, -50%)';
    pauseMenu.style.width = '400px';
    pauseMenu.style.backgroundColor = '#222';
    pauseMenu.style.border = '3px solid #880015';
    pauseMenu.style.borderRadius = '8px';
    pauseMenu.style.padding = '20px';
    pauseMenu.style.color = '#fff';
    pauseMenu.style.fontFamily = 'Arial, sans-serif';
    pauseMenu.style.textAlign = 'center';
    pauseMenu.style.zIndex = '10';
    pauseMenu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    pauseMenu.style.display = 'flex';
    pauseMenu.style.flexDirection = 'column';
    pauseMenu.style.alignItems = 'center';

    const title = document.createElement('h2');
    title.textContent = 'Paused';
    title.style.fontSize = '24px';
    title.style.marginBottom = '15px';
    title.style.color = '#fff';
    pauseMenu.appendChild(title);

    const buttonStyle = {
        padding: '10px 20px',
        margin: '10px 0',
        fontSize: '16px',
        backgroundColor: '#880015',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '80%',
    };

    function styleButton(button, hoverColor) {
        Object.assign(button.style, buttonStyle);
        button.onmouseover = () => button.style.backgroundColor = hoverColor;
        button.onmouseout = () => button.style.backgroundColor = buttonStyle.backgroundColor;
    }

    const resumeButton = document.createElement('button');
    resumeButton.textContent = 'Resume';
    styleButton(resumeButton, '#a4001a');
    resumeButton.addEventListener('click', togglePause);
    pauseMenu.appendChild(resumeButton);

    const saveGameButton = document.createElement('button');
    saveGameButton.textContent = 'Save Game';
    styleButton(saveGameButton, '#a4001a');
    saveGameButton.addEventListener('click', () => {
        saveProgress();
    });
    pauseMenu.appendChild(saveGameButton);

    const quitButton = document.createElement('button');
    quitButton.textContent = 'Quit';
    styleButton(quitButton, '#a4001a');
    quitButton.addEventListener('click', () => {
        location.reload();
    });
    pauseMenu.appendChild(quitButton);

    const feedbackLink = document.createElement('a');
    feedbackLink.textContent = 'Leave Feedback';
    feedbackLink.href = '/Feedback/LeaveFeedback';
    feedbackLink.style.color = '#ffcc00';
    feedbackLink.style.textDecoration = 'underline';
    feedbackLink.style.marginTop = '15px';
    feedbackLink.style.fontSize = '14px';
    pauseMenu.appendChild(feedbackLink);

    document.body.appendChild(pauseMenu);

    return pauseMenu;
}

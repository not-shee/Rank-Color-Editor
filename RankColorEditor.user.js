// ==UserScript==
// @name         Rank Color Editor
// @version      1.0
// @description  Allows you to modify the colors of rank on the osu! website
// @match        http://osu.ppy.sh/*
// @match        https://osu.ppy.sh/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    const ranks = [
    "iron",
    "bronze",
    "silver",
    "gold",
    "platinum",
    "rhodium",
    "radiant",
    "lustrous",
    ];

    ranks.forEach(rank => {
        GM_addStyle(`
            .rank-value--${rank} {
                color: ${GM_getValue(rank)};
            }
        `);
    });

    const observer = new MutationObserver(function(mutationList){
            for(var mutation of mutationList){
                if (mutation.addedNodes.length) {
                    createSettingsButton();
                    createResetButton();
                }
            }
        });

    observer.observe(document.documentElement, {
        childList: true,
    });

    function outsideClickHandler(e) {
        const popup = document.getElementById('settings-popup');

        if (!popup) {
            document.removeEventListener("click", outsideClickHandler);
            return;
        };

        if (!popup.contains(e.target)) {
            popup.remove();
            document.removeEventListener("click", outsideClickHandler);
        }
    }

    function createResetButton() {
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style.top = '45px';
        resetBtn.classList.add('button');
        resetBtn.addEventListener('click', () => {
            ranks.forEach(rank => {
                GM_setValue(rank, null);
                window.location.reload();
            });
        });

        document.body.appendChild(resetBtn);
    }

    function createSettingsButton() {
        const openBtn = document.createElement('button');
        openBtn.textContent = 'Settings';
        openBtn.style.top = '20px';
        openBtn.id = 'settings-button';
        openBtn.classList.add('button');
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const popup = document.getElementById('settings-popup');
            if (popup) {
                popup.remove();
                document.removeEventListener("click", outsideClickHandler);
            } else {
                createSettings();
                document.addEventListener("click", outsideClickHandler);
            }
        });

        document.body.appendChild(openBtn);
    }

    function createSettings() {

        const settings = document.createElement('div');
        settings.id = 'settings-popup';

        const infoContainer = document.createElement('div');
        infoContainer.classList.add("info-container");

        const title = document.createElement('span');
        title.textContent = 'Rank Color Editor';
        title.classList.add("title");
        title.style.fontSize = '24px';
        infoContainer.appendChild(title);

        const author = document.createElement('span');
        author.textContent = 'by ';

        const link = document.createElement('a');
        link.href = "https://www.youtube.com/@shee19";
        link.textContent = "Shee";
        link.style.color = "hsl(var(--hsl-h1))";
        author.appendChild(link);

        infoContainer.appendChild(author);

        const pickerContainer = document.createElement('div');
        pickerContainer.classList.add("picker-container");

        ranks.forEach(rank => {
            const row = document.createElement('div');
            row.classList.add("rank-row");

            const span = document.createElement('span');
            const capitalized = rank.charAt(0).toUpperCase() + rank.slice(1);
            span.textContent = `${capitalized} color: `;

            const picker = createColorPicker(rank);

            row.appendChild(span);
            row.appendChild(picker);
            pickerContainer.appendChild(row);
        });

        const version = document.createElement('span');
        version.classList.add("version");
        version.textContent = 'version 1.0';
        infoContainer.appendChild(version);

        settings.appendChild(infoContainer);
        settings.appendChild(pickerContainer);

        document.body.appendChild(settings);
    }

    function createColorPicker(currentColor){
        const picker = document.createElement('input');
        picker.type = 'color';
        picker.value = GM_getValue(currentColor, null);
        picker.title = 'Pick a color';
        picker.classList.add("rank-picker");
        picker.addEventListener("input", (e) => {
            GM_addStyle(`
            .rank-value--${currentColor} {
                color: ${e.target.value};
            }
            `);
        });
        picker.addEventListener("change", (e) => {
            GM_setValue(currentColor, e.target.value);
        });
        return picker;
    }

    GM_addStyle(`
        .button {
            position: fixed;
            right: 20px;
            background: #222;
            border: none;
            cursor: pointer;
            font-size: 14px;
            z-index: 9999;
        }

        #settings-popup {
            position: fixed;
            top: 20px;
            right: 100px;
            width: 480px;
            padding: 10px;
            background: #222;
            border: 1px solid #444;
            border-radius: 8px;
            z-index: 99999;
            font-family: torus;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .picker-container {
            display: flex;
            flex-direction: column;
        }

        .info-container {
            margin-left: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .title {
            font-weight: bold;
        }

        .version {
            position: absolute;
            bottom: 20px;
            left: 20px;
            font-size: 10px;
            color: #8f8f8f;
        }

        .rank-row {
            display: grid;
            grid-template-columns: 120px 1fr;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }

        .rank-picker {
            width: 40px;
            height: 40px;
            border: 1px solid #444;
            cursor: pointer;
            padding: 0;
        }
        `);

})();





document.addEventListener("DOMContentLoaded", () => {
    const cryptoContainer = document.getElementById("cryptoContainer");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    function displayCryptos(data) {
        cryptoContainer.innerHTML = ''; 
        data.forEach(crypto => {
            const card = document.createElement('div');
            card.className = 'crypto-card';

            const priceChangeClass = crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative';

            card.innerHTML = `
                <img src="${crypto.image}" alt="${crypto.name}">
                <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
                <p>💲 Price: $${crypto.current_price.toLocaleString()}</p>
                <p class="${priceChangeClass}">${crypto.price_change_percentage_24h.toFixed(2)}% (24h)</p>
                <p> Market Cap: $${crypto.market_cap.toLocaleString()}</p>
            `;
            cryptoContainer.appendChild(card);
        });
    }
    async function fetchTopCryptos() {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
        const data = await res.json();
        displayCryptos(data);
    }
    async function searchCrypto() {
        const query = searchInput.value.trim().toLowerCase();
        if(!query) return fetchTopCryptos();

        const searchRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
        const searchData = await searchRes.json();

        if(!searchData.coins.length) {
            cryptoContainer.innerHTML = '<p style="text-align:center; color:white; font-weight:bold;">❌ No crypto found!</p>';
            return;
        }
        const coinId = searchData.coins[0].id;
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`);
        const data = await res.json();
        displayCryptos(data);
    }

    searchBtn.addEventListener('click', searchCrypto);

    fetchTopCryptos();
    setInterval(fetchTopCryptos, 60000); 
});

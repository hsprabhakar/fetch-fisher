const fs = require('fs').promises;

async function fetchAndProcessData() {
    const fetch = (await import('node-fetch')).default; // Dynamic import

    const API_URL = "https://www.thermofisher.com/api/store/loyalty/trials/v1.0/getTrialSkuAttributes";
    const PAYLOAD = {
        countryCode: "ca",
        filter: "",
        gpt: "",
        level: 0,
        search: false,
        searchString: "",
        skuRangeEnd: 10000,
        skuRangeStart: 1,
        userKey: 3602663780,
        userName: "saurab@ualberta.ca"
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(PAYLOAD)
        });

        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        const data = await response.json();
        await fs.writeFile("trials.json", JSON.stringify(data, null, 2));
        console.log("JSON saved to trials.json");

        const trials = data.trialsSkuList || [];
        if (trials.length === 0) {
            console.log("No trial items found.");
            return;
        }

        const highestPointItem = trials.reduce((max, item) => {
            if (typeof item.points === 'number' && item.points > max.points) {
                return item;
            }
            return max;
        }, trials[0]);

        console.log("Item with highest points:", highestPointItem);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchAndProcessData();

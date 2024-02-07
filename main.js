document.addEventListener("DOMContentLoaded", function () {
	displayCityHistory() // Wywołuje funkcję wyświetlającą historię miast po załadowaniu zawartości strony
})

function getWeather() {
	const apiKey = "86898b22caffb26fc93fef93696abe84" // Zastępuje 'YOUR_API_KEY' swoim kluczem API
	const city = document.getElementById("cityInput").value

	// Sprawdza, czy wprowadzono nazwę miasta lub wartość nie jest liczbą
	if (!city || !isNaN(city)) {
		alert("Podaj poprawną nazwę miasta!")
		return
	}

	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=pl&appid=${apiKey}`

	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			if (data.cod === "404") {
				alert("Nie znaleziono miasta") // Wyświetla alert, jeśli nie znaleziono miasta
				return
			}
			displayWeather(data) // Wyświetla dane pogodowe
			addToCityHistory(city) // Dodaje wyszukane miasto do historii
		})
		.catch(error => {
			console.error("Error fetching weather data:", error) // Wyświetla błąd związany z pobieraniem danych pogodowych
			alert("Nie udało się pobrać danych pogodowych. Spróbuj ponownie później.")
		})
}

function displayWeather(data) {
	const weatherInfo = document.getElementById("weatherInfo")

	const temperature = Math.round(data.main.temp - 273.15) // Oblicza temperaturę w stopniach Celsiusza
	const weatherIcon = data.weather[0].icon // Pobiera ikonę pogodową
	const weatherDescription = data.weather[0].description // Pobiera opis pogody

	// Wyświetla informacje o pogodzie
	weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <div class="weather-details">
            <div class="weather-icon">
                <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
            </div>
            <div class="temperature">${temperature}°C</div>
        </div>
        <p>Pogoda: ${weatherDescription}</p>
    `
}

function addToCityHistory(city) {
	let cityHistory = localStorage.getItem("cityHistory") || "[]" // Pobiera historię miast z localStorage lub inicjuje pustą tablicę
	cityHistory = JSON.parse(cityHistory) // Parsuje historię miast do tablicy JavaScript
	cityHistory.unshift(city) // Dodaje wyszukane miasto na początek historii
	cityHistory = Array.from(new Set(cityHistory)) // Usuwa duplikaty z historii miast
	localStorage.setItem("cityHistory", JSON.stringify(cityHistory.slice(0, 5))) // Zapisuje historię miast do localStorage i ogranicza do 5 miast
	displayCityHistory() // Wyświetla zaktualizowaną historię miast
}

function displayCityHistory() {
	const cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [] // Pobiera historię miast z localStorage lub inicjuje pustą tablicę
	const cityHistoryElement = document.getElementById("cityHistory") // Pobiera element, gdzie ma być wyświetlona historia miast
	cityHistoryElement.innerHTML = "" // Czyści zawartość historii miast

	// Wyświetla przyciski z nazwami miast w historii
	cityHistory.forEach(city => {
		const button = document.createElement("button") // Tworzy nowy przycisk
		button.textContent = city // Ustawia nazwę miasta na przycisku
		button.onclick = function () {
			document.getElementById("cityInput").value = city // Ustawia wartość pola wejściowego na wybrane miasto
			getWeather() // Pobiera informacje o pogodzie dla wybranego miasta
		}
		cityHistoryElement.appendChild(button) // Dodaje przycisk do historii miast
	})
}

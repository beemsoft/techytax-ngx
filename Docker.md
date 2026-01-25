# 💡 Frontend Troubleshooting: Browser Caching

Wanneer de frontend via Docker wordt gedraaid, fungeert **Nginx** als webserver. In tegenstelling tot de Angular ontwikkelserver (`npm start`), is Nginx geconfigureerd om statische bestanden efficiënt te serveren. Hierdoor kan je browser oude versies van de code vasthouden, zelfs nadat je een nieuwe Docker-build hebt uitgevoerd.

## 🚀 Het Probleem: "Wijzigingen in de nieuwe versie zijn niet zichtbaar"
Omdat Nginx cache-headers meestuurt, hergebruikt de browser lokaal opgeslagen JavaScript- en CSS-bestanden. Hierdoor zie je de oude staat van de applicatie terwijl de Docker-container wel de nieuwe code bevat.

## 🛠 De Oplossing: Hard Refresh

Om de browser te dwingen de lokale cache te negeren en de nieuwste bestanden uit de container te laden, moet je een **Hard Refresh** uitvoeren.

### Sneltoetsen
| Besturingssysteem | Combinatie |
| :--- | :--- |
| **Windows / Linux** | `Ctrl` + `F5` of `Ctrl` + `Shift` + `R` |
| **macOS (Chrome/Firefox)** | `Cmd` + `Shift` + `R` |
| **macOS (Safari)** | `Option` + `Cmd` + `E` (leeg cache) en herlaad |

---

### De "Gegarandeerde" Methode (via DevTools)
Voor ontwikkeling is dit de meest betrouwbare methode, omdat het caching tijdelijk volledig uitschakelt:

1. Open de **Ontwikkelaarstools** (`F12` of `Inspecteren`).
2. Ga naar het tabblad **Network**.
3. Vink het vakje **Disable cache** aan.
4. **Herlaad de pagina** (bijv. met `F5`) terwijl het DevTools-venster geopend blijft.




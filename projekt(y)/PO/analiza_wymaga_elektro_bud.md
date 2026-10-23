# Projekt Elektro-Bud – analiza wymagań

## 1. Wymagania funkcjonalne

| Identyfikator | Nazwa | Opis |
| :--- | :--- | :--- |
| **FR-01** | Logowanie użytkownika | System powinien umożliwiać użytkownikowi uwierzytelnienie się przy użyciu indywidualnego konta i hasła. |
| **FR-02** | Wyszukiwanie produktu i lokalizacji | System powinien umożliwiać wyszukanie informacji o produkcie oraz jego lokalizacji (sektor, regał, półka) na podstawie kodu EAN lub nazwy produktu. |
| **FR-03** | Zarządzanie produktami | System powinien umożliwiać kierownikowi dodawanie, edycję oraz usuwanie informacji o produktach (kod EAN, nazwa, kategoria, sektor, regał, półka). |
| **FR-04** | Przeglądanie stanów magazynowych | System powinien przechowywać i wyświetlać aktualną ilość każdego produktu znajdującego się w magazynie. |
| **FR-05** | Rejestracja przyjęcia towaru | System powinien umożliwiać magazynierowi zarejestrowanie przyjęcia towaru (produkt, ilość, wykonawca, data i czas), co automatycznie zwiększa stan magazynowy. |
| **FR-06** | Rejestracja wydania towaru | System powinien umożliwiać magazynierowi zarejestrowanie wydania towaru (produkt, ilość, wykonawca, data i czas), co automatycznie zmniejsza stan magazynowy. |
| **FR-07** | Walidacja dostępności towaru przy wydaniu | System powinien blokować możliwość wydania większej liczby sztuk produktu, niż znajduje się aktualnie na stanie w magazynie. |
| **FR-08** | Przeglądanie historii operacji | System powinien umożliwiać kierownikowi przeglądanie historii wszystkich operacji magazynowych z informacją kto, kiedy, jakiego produktu i jakiej operacji dokonał. |
| **FR-09** | Generowanie raportów magazynowych | System powinien umożliwiać kierownikowi generowanie i przeglądanie raportów dotyczących stanu oraz funkcjonowania magazynu. |
| **FR-10** | Zarządzanie kontami użytkowników | System powinien umożliwiać administratorowi tworzenie, edycję i blokowanie kont użytkowników oraz nadawanie im ról (Magazynier, Kierownik, Administrator). |
| **FR-11** | Resetowanie zapomnianego hasła | System powinien umożliwiać administratorowi obsługę zgłoszeń dotyczących zapomnianego hasła i jego zresetowanie dla wybranego użytkownika. |

## 2. Wymagania niefunkcjonalne

| Identyfikator | Nazwa | Opis |
| :--- | :--- | :--- |
| **NFR-01** | Wydajność wyszukiwania | System powinien odpowiadać na operacje wyszukiwania produktu oraz obsługę kodu EAN w czasie nie dłuższym niż 1–2 sekundy w typowych warunkach pracy. |
| **NFR-02** | Bezpieczeństwo haseł | Hasła użytkowników muszą być przechowywane w bazie danych w postaci zahaszowanej, uniemożliwiającej ich odczytanie w postaci jawnej. |
| **NFR-03** | Kontrola dostępu | Dostęp do poszczególnych funkcji systemu musi być restrykcyjnie ograniczony na podstawie przypisanej roli zalogowanego użytkownika. |
| **NFR-04** | Współbieżność operacji | System musi zapewniać spójność danych w sytuacji, gdy dwóch lub więcej pracowników wykonuje operację na tym samym produkcie w tym samym czasie. |
| **NFR-05** | Dostępność zdalna | System musi działać jako aplikacja webowa dostępna przez przeglądarkę internetową, umożliwiając kierownikowi dostęp do danych spoza stanowiska w magazynie. |
| **NFR-06** | Użyteczność interfejsu | Interfejs dla magazynierów powinien być czytelny i przystosowany do szybkiej obsługi codziennych operacji magazynowych oraz wprowadzania kodów EAN. |

## 3. Aktorzy

* **Magazynier** — pracownik odpowiadający za bieżącą obsługę fizyczną magazynu. Podstawowe działania: logowanie do systemu, wyszukiwanie produktów po kodzie EAN lub nazwie, sprawdzanie lokalizacji towaru, rejestrowanie przyjęć i wydań towaru.
* **Kierownik magazynu** — osoba nadzorująca pracę magazynu i zarządzająca asortymentem. Podstawowe działania: logowanie do systemu, przeglądanie aktualnych stanów magazynowych, zarządzanie danymi produktów, przeglądanie historii operacji, generowanie raportów.
* **Administrator** — osoba odpowiedzialna za utrzymanie kont i bezpieczeństwo dostępu do systemu. Podstawowe działania: logowanie do systemu, zarządzanie kontami użytkowników, nadawanie uprawnień i ról, resetowanie zapomnianych haseł.
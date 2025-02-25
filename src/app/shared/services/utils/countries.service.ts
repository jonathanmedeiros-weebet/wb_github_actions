import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CountriesService {

    constructor(
    ) {
    }

    getCountries() {
        return [
            { value: 1, name: 'Afeganistão' },
            { value: 2, name: 'África do Sul' },
            { value: 3, name: 'Albânia' },
            { value: 4, name: 'Alemanha' },
            { value: 5, name: 'Andorra' },
            { value: 6, name: 'Angola' },
            { value: 7, name: 'Antígua e Barbuda' },
            { value: 8, name: 'Arábia Saudita' },
            { value: 9, name: 'Argélia' },
            { value: 10, name: 'Argentina' },
            { value: 11, name: 'Armênia' },
            { value: 12, name: 'Austrália' },
            { value: 13, name: 'Áustria' },
            { value: 14, name: 'Azerbaijão' },
            { value: 15, name: 'Bahamas' },
            { value: 16, name: 'Bangladesh' },
            { value: 17, name: 'Barbados' },
            { value: 18, name: 'Barein' },
            { value: 19, name: 'Bélgica' },
            { value: 20, name: 'Belize' },
            { value: 21, name: 'Benim' },
            { value: 22, name: 'Bielorrússia' },
            { value: 23, name: 'Bolívia' },
            { value: 24, name: 'Bósnia e Herzegovina' },
            { value: 25, name: 'Botsuana' },
            { value: 26, name: 'Brasil' },
            { value: 27, name: 'Brunei' },
            { value: 28, name: 'Bulgária' },
            { value: 29, name: 'Burkina Faso' },
            { value: 30, name: 'Burundi' },
            { value: 31, name: 'Butão' },
            { value: 32, name: 'Cabo Verde' },
            { value: 33, name: 'Camarões' },
            { value: 34, name: 'Camboja' },
            { value: 35, name: 'Canadá' },
            { value: 36, name: 'Catar' },
            { value: 37, name: 'Cazaquistão' },
            { value: 38, name: 'Chade' },
            { value: 39, name: 'Chile' },
            { value: 40, name: 'China' },
            { value: 41, name: 'Chipre' },
            { value: 42, name: 'Colômbia' },
            { value: 43, name: 'Comores' },
            { value: 44, name: 'Coreia do Norte' },
            { value: 45, name: 'Coreia do Sul' },
            { value: 46, name: 'Costa do Marfim' },
            { value: 47, name: 'Costa Rica' },
            { value: 48, name: 'Croácia' },
            { value: 49, name: 'Cuba' },
            { value: 50, name: 'Dinamarca' },
            { value: 51, name: 'Djibuti' },
            { value: 52, name: 'Dominica' },
            { value: 53, name: 'Egito' },
            { value: 54, name: 'El Salvador' },
            { value: 55, name: 'Emirados Árabes Unidos' },
            { value: 56, name: 'Equador' },
            { value: 57, name: 'Eritreia' },
            { value: 58, name: 'Eslováquia' },
            { value: 59, name: 'Eslovênia' },
            { value: 60, name: 'Espanha' },
            { value: 61, name: 'Estados Unidos' },
            { value: 62, name: 'Estônia' },
            { value: 63, name: 'Eswatini' },
            { value: 64, name: 'Etiópia' },
            { value: 65, name: 'Fiji' },
            { value: 66, name: 'Filipinas' },
            { value: 67, name: 'Finlândia' },
            { value: 68, name: 'França' },
            { value: 69, name: 'Gabão' },
            { value: 70, name: 'Gâmbia' },
            { value: 71, name: 'Gana' },
            { value: 72, name: 'Geórgia' },
            { value: 73, name: 'Granada' },
            { value: 74, name: 'Grécia' },
            { value: 75, name: 'Guatemala' },
            { value: 76, name: 'Guiana' },
            { value: 77, name: 'Guiné' },
            { value: 78, name: 'Guiné-Bissau' },
            { value: 79, name: 'Haiti' },
            { value: 80, name: 'Honduras' },
            { value: 81, name: 'Hungria' },
            { value: 82, name: 'Iêmen' },
            { value: 83, name: 'Ilhas Maldivas' },
            { value: 84, name: 'Índia' },
            { value: 85, name: 'Indonésia' },
            { value: 86, name: 'Irã' },
            { value: 87, name: 'Iraque' },
            { value: 88, name: 'Irlanda' },
            { value: 89, name: 'Islândia' },
            { value: 90, name: 'Israel' },
            { value: 91, name: 'Itália' },
            { value: 92, name: 'Jamaica' },
            { value: 93, name: 'Japão' },
            { value: 94, name: 'Jordânia' },
            { value: 95, name: 'Letônia' },
            { value: 96, name: 'Líbano' },
            { value: 97, name: 'Líbia' },
            { value: 98, name: 'Malásia' },
            { value: 99, name: 'Moçambique' },
            { value: 100, name: 'Zimbábue' },
        ];
    }

    getDialcodes() {
        return [
            {
                name: "Canada",
                dial_code: "+1",
                emoji: "🇨🇦",
                code: "CA"
            },
            {
                name: "United States",
                dial_code: "+1",
                emoji: "🇺🇸",
                code: "US"
            },
            {
                name: "Russia",
                dial_code: "+7",
                emoji: "🇷🇺",
                code: "RU"
            },
            {
                name: "Egypt",
                dial_code: "+20",
                emoji: "🇪🇬",
                code: "EG"
            },
            {
                name: "South Africa",
                dial_code: "+27",
                emoji: "🇿🇦",
                code: "ZA"
            },
            {
                name: "Greece",
                dial_code: "+30",
                emoji: "🇬🇷",
                code: "GR"
            },
            {
                name: "Netherlands",
                dial_code: "+31",
                emoji: "🇳🇱",
                code: "NL"
            },
            {
                name: "Belgium",
                dial_code: "+32",
                emoji: "🇧🇪",
                code: "BE"
            },
            {
                name: "France",
                dial_code: "+33",
                emoji: "🇫🇷",
                code: "FR"
            },
            {
                name: "Spain",
                dial_code: "+34",
                emoji: "🇪🇸",
                code: "ES"
            },
            {
                name: "Hungary",
                dial_code: "+36",
                emoji: "🇭🇺",
                code: "HU"
            },
            {
                name: "Italy",
                dial_code: "+39",
                emoji: "🇮🇹",
                code: "IT"
            },
            {
                name: "Romania",
                dial_code: "+40",
                emoji: "🇷🇴",
                code: "RO"
            },
            {
                name: "Switzerland",
                dial_code: "+41",
                emoji: "🇨🇭",
                code: "CH"
            },
            {
                name: "Austria",
                dial_code: "+43",
                emoji: "🇦🇹",
                code: "AT"
            },
            {
                name: "Guernsey",
                dial_code: "+44",
                emoji: "🇬🇬",
                code: "GG"
            },
            {
                name: "Isle of Man",
                dial_code: "+44",
                emoji: "🇮🇲",
                code: "IM"
            },
            {
                name: "Jersey",
                dial_code: "+44",
                emoji: "🇯🇪",
                code: "JE"
            },
            {
                name: "United Kingdom",
                dial_code: "+44",
                emoji: "🇬🇧",
                code: "GB"
            },
            {
                name: "Denmark",
                dial_code: "+45",
                emoji: "🇩🇰",
                code: "DK"
            },
            {
                name: "Sweden",
                dial_code: "+46",
                emoji: "🇸🇪",
                code: "SE"
            },
            {
                name: "Norway",
                dial_code: "+47",
                emoji: "🇳🇴",
                code: "NO"
            },
            {
                name: "Svalbard and Jan Mayen",
                dial_code: "+47",
                emoji: "🇸🇯",
                code: "SJ"
            },
            {
                name: "Poland",
                dial_code: "+48",
                emoji: "🇵🇱",
                code: "PL"
            },
            {
                name: "Germany",
                dial_code: "+49",
                emoji: "🇩🇪",
                code: "DE"
            },
            {
                name: "Peru",
                dial_code: "+51",
                emoji: "🇵🇪",
                code: "PE"
            },
            {
                name: "Mexico",
                dial_code: "+52",
                emoji: "🇲🇽",
                code: "MX"
            },
            {
                name: "Cuba",
                dial_code: "+53",
                emoji: "🇨🇺",
                code: "CU"
            },
            {
                name: "Argentina",
                dial_code: "+54",
                emoji: "🇦🇷",
                code: "AR"
            },
            {
                name: "Brasil",
                dial_code: "+55",
                emoji: "🇧🇷",
                code: "BR"
            },
            {
                name: "Chile",
                dial_code: "+56",
                emoji: "🇨🇱",
                code: "CL"
            },
            {
                name: "Colombia",
                dial_code: "+57",
                emoji: "🇨🇴",
                code: "CO"
            },
            {
                name: "Venezuela, Bolivarian Republic of Venezuela",
                dial_code: "+58",
                emoji: "🇻🇪",
                code: "VE"
            },
            {
                name: "Malaysia",
                dial_code: "+60",
                emoji: "🇲🇾",
                code: "MY"
            },
            {
                name: "Australia",
                dial_code: "+61",
                emoji: "🇦🇺",
                code: "AU"
            },
            {
                name: "Christmas Island",
                dial_code: "+61",
                emoji: "🇨🇽",
                code: "CX"
            },
            {
                name: "Cocos (Keeling) Islands",
                dial_code: "+61",
                emoji: "🇨🇨",
                code: "CC"
            },
            {
                name: "Indonesia",
                dial_code: "+62",
                emoji: "🇮🇩",
                code: "ID"
            },
            {
                name: "Philippines",
                dial_code: "+63",
                emoji: "🇵🇭",
                code: "PH"
            },
            {
                name: "New Zealand",
                dial_code: "+64",
                emoji: "🇳🇿",
                code: "NZ"
            },
            {
                name: "Singapore",
                dial_code: "+65",
                emoji: "🇸🇬",
                code: "SG"
            },
            {
                name: "Thailand",
                dial_code: "+66",
                emoji: "🇹🇭",
                code: "TH"
            },
            {
                name: "Kazakhstan",
                dial_code: "+77",
                emoji: "🇰🇿",
                code: "KZ"
            },
            {
                name: "Japan",
                dial_code: "+81",
                emoji: "🇯🇵",
                code: "JP"
            },
            {
                name: "Korea, Republic of South Korea",
                dial_code: "+82",
                emoji: "🇰🇷",
                code: "KR"
            },
            {
                name: "Vietnam",
                dial_code: "+84",
                emoji: "🇻🇳",
                code: "VN"
            },
            {
                name: "China",
                dial_code: "+86",
                emoji: "🇨🇳",
                code: "CN"
            },
            {
                name: "Turkey",
                dial_code: "+90",
                emoji: "🇹🇷",
                code: "TR"
            },
            {
                name: "India",
                dial_code: "+91",
                emoji: "🇮🇳",
                code: "IN"
            },
            {
                name: "Pakistan",
                dial_code: "+92",
                emoji: "🇵🇰",
                code: "PK"
            },
            {
                name: "Afghanistan",
                dial_code: "+93",
                emoji: "🇦🇫",
                code: "AF"
            },
            {
                name: "Sri Lanka",
                dial_code: "+94",
                emoji: "🇱🇰",
                code: "LK"
            },
            {
                name: "Myanmar",
                dial_code: "+95",
                emoji: "🇲🇲",
                code: "MM"
            },
            {
                name: "Iran, Islamic Republic of Persian Gulf",
                dial_code: "+98",
                emoji: "🇮🇷",
                code: "IR"
            },
            {
                name: "South Sudan",
                dial_code: "+211",
                emoji: "🇸🇸",
                code: "SS"
            },
            {
                name: "Morocco",
                dial_code: "+212",
                emoji: "🇲🇦",
                code: "MA"
            },
            {
                name: "Algeria",
                dial_code: "+213",
                emoji: "🇩🇿",
                code: "DZ"
            },
            {
                name: "Tunisia",
                dial_code: "+216",
                emoji: "🇹🇳",
                code: "TN"
            },
            {
                name: "Libyan Arab Jamahiriya",
                dial_code: "+218",
                emoji: "🇱🇾",
                code: "LY"
            },
            {
                name: "Gambia",
                dial_code: "+220",
                emoji: "🇬🇲",
                code: "GM"
            },
            {
                name: "Senegal",
                dial_code: "+221",
                emoji: "🇸🇳",
                code: "SN"
            },
            {
                name: "Mauritania",
                dial_code: "+222",
                emoji: "🇲🇷",
                code: "MR"
            },
            {
                name: "Mali",
                dial_code: "+223",
                emoji: "🇲🇱",
                code: "ML"
            },
            {
                name: "Guinea",
                dial_code: "+224",
                emoji: "🇬🇳",
                code: "GN"
            },
            {
                name: "Cote d'Ivoire",
                dial_code: "+225",
                emoji: "🇨🇮",
                code: "CI"
            },
            {
                name: "Burkina Faso",
                dial_code: "+226",
                emoji: "🇧🇫",
                code: "BF"
            },
            {
                name: "Niger",
                dial_code: "+227",
                emoji: "🇳🇪",
                code: "NE"
            },
            {
                name: "Togo",
                dial_code: "+228",
                emoji: "🇹🇬",
                code: "TG"
            },
            {
                name: "Benin",
                dial_code: "+229",
                emoji: "🇧🇯",
                code: "BJ"
            },
            {
                name: "Mauritius",
                dial_code: "+230",
                emoji: "🇲🇺",
                code: "MU"
            },
            {
                name: "Liberia",
                dial_code: "+231",
                emoji: "🇱🇷",
                code: "LR"
            },
            {
                name: "Sierra Leone",
                dial_code: "+232",
                emoji: "🇸🇱",
                code: "SL"
            },
            {
                name: "Ghana",
                dial_code: "+233",
                emoji: "🇬🇭",
                code: "GH"
            },
            {
                name: "Nigeria",
                dial_code: "+234",
                emoji: "🇳🇬",
                code: "NG"
            },
            {
                name: "Chad",
                dial_code: "+235",
                emoji: "🇹🇩",
                code: "TD"
            },
            {
                name: "Central African Republic",
                dial_code: "+236",
                emoji: "🇨🇫",
                code: "CF"
            },
            {
                name: "Cameroon",
                dial_code: "+237",
                emoji: "🇨🇲",
                code: "CM"
            },
            {
                name: "Cape Verde",
                dial_code: "+238",
                emoji: "🇨🇻",
                code: "CV"
            },
            {
                name: "Sao Tome and Principe",
                dial_code: "+239",
                emoji: "🇸🇹",
                code: "ST"
            },
            {
                name: "Equatorial Guinea",
                dial_code: "+240",
                emoji: "🇬🇶",
                code: "GQ"
            },
            {
                name: "Gabon",
                dial_code: "+241",
                emoji: "🇬🇦",
                code: "GA"
            },
            {
                name: "Congo",
                dial_code: "+242",
                emoji: "🇨🇬",
                code: "CG"
            },
            {
                name: "Congo, The Democratic Republic of the Congo",
                dial_code: "+243",
                emoji: "🇨🇩",
                code: "CD"
            },
            {
                name: "Angola",
                dial_code: "+244",
                emoji: "🇦🇴",
                code: "AO"
            },
            {
                name: "Guinea-Bissau",
                dial_code: "+245",
                emoji: "🇬🇼",
                code: "GW"
            },
            {
                name: "British Indian Ocean Territory",
                dial_code: "+246",
                emoji: "🇮🇴",
                code: "IO"
            },
            {
                name: "Seychelles",
                dial_code: "+248",
                emoji: "🇸🇨",
                code: "SC"
            },
            {
                name: "Sudan",
                dial_code: "+249",
                emoji: "🇸🇩",
                code: "SD"
            },
            {
                name: "Rwanda",
                dial_code: "+250",
                emoji: "🇷🇼",
                code: "RW"
            },
            {
                name: "Ethiopia",
                dial_code: "+251",
                emoji: "🇪🇹",
                code: "ET"
            },
            {
                name: "Somalia",
                dial_code: "+252",
                emoji: "🇸🇴",
                code: "SO"
            },
            {
                name: "Djibouti",
                dial_code: "+253",
                emoji: "🇩🇯",
                code: "DJ"
            },
            {
                name: "Kenya",
                dial_code: "+254",
                emoji: "🇰🇪",
                code: "KE"
            },
            {
                name: "Tanzania, United Republic of Tanzania",
                dial_code: "+255",
                emoji: "🇹🇿",
                code: "TZ"
            },
            {
                name: "Uganda",
                dial_code: "+256",
                emoji: "🇺🇬",
                code: "UG"
            },
            {
                name: "Burundi",
                dial_code: "+257",
                emoji: "🇧🇮",
                code: "BI"
            },
            {
                name: "Mozambique",
                dial_code: "+258",
                emoji: "🇲🇿",
                code: "MZ"
            },
            {
                name: "Zambia",
                dial_code: "+260",
                emoji: "🇿🇲",
                code: "ZM"
            },
            {
                name: "Madagascar",
                dial_code: "+261",
                emoji: "🇲🇬",
                code: "MG"
            },
            {
                name: "Mayotte",
                dial_code: "+262",
                emoji: "🇾🇹",
                code: "YT"
            },
            {
                name: "Reunion",
                dial_code: "+262",
                emoji: "🇷🇪",
                code: "RE"
            },
            {
                name: "Zimbabwe",
                dial_code: "+263",
                emoji: "🇿🇼",
                code: "ZW"
            },
            {
                name: "Namibia",
                emoji: "🇳🇦",
                dial_code: "+264",
                code: "NA"
            },
            {
                name: "Malawi",
                dial_code: "+265",
                emoji: "🇲🇼",
                code: "MW"
            },
            {
                name: "Lesotho",
                dial_code: "+266",
                emoji: "🇱🇸",
                code: "LS"
            },
            {
                name: "Botswana",
                dial_code: "+267",
                emoji: "🇧🇼",
                code: "BW"
            },
            {
                name: "Swaziland",
                dial_code: "+268",
                emoji: "🇸🇿",
                code: "SZ"
            },
            {
                name: "Comoros",
                dial_code: "+269",
                emoji: "🇰🇲",
                code: "KM"
            },
            {
                name: "Saint Helena, Ascension and Tristan Da Cunha",
                dial_code: "+290",
                emoji: "🇸🇭",
                code: "SH"
            },
            {
                name: "Eritrea",
                dial_code: "+291",
                emoji: "🇪🇷",
                code: "ER"
            },
            {
                name: "Aruba",
                dial_code: "+297",
                emoji: "🇦🇼",
                code: "AW"
            },
            {
                name: "Faroe Islands",
                dial_code: "+298",
                emoji: "🇫🇴",
                code: "FO"
            },
            {
                name: "Greenland",
                dial_code: "+299",
                emoji: "🇬🇱",
                code: "GL"
            },
            {
                name: "Cayman Islands",
                dial_code: "+345",
                emoji: "🇰🇾",
                code: "KY"
            },
            {
                name: "Gibraltar",
                dial_code: "+350",
                emoji: "🇬🇮",
                code: "GI"
            },
            {
                name: "Portugal",
                dial_code: "+351",
                emoji: "🇵🇹",
                code: "PT"
            },
            {
                name: "Luxembourg",
                dial_code: "+352",
                emoji: "🇱🇺",
                code: "LU"
            },
            {
                name: "Ireland",
                dial_code: "+353",
                emoji: "🇮🇪",
                code: "IE"
            },
            {
                name: "Iceland",
                dial_code: "+354",
                emoji: "🇮🇸",
                code: "IS"
            },
            {
                name: "Albania",
                dial_code: "+355",
                emoji: "🇦🇱",
                code: "AL"
            },
            {
                name: "Malta",
                dial_code: "+356",
                emoji: "🇲🇹",
                code: "MT"
            },
            {
                name: "Cyprus",
                dial_code: "+357",
                emoji: "🇨🇾",
                code: "CY"
            },
            {
                name: "Aland Islands",
                dial_code: "+358",
                emoji: "🇦🇽",
                code: "AX"
            },
            {
                name: "Finland",
                dial_code: "+358",
                emoji: "🇫🇮",
                code: "FI"
            },
            {
                name: "Bulgaria",
                dial_code: "+359",
                emoji: "🇧🇬",
                code: "BG"
            },
            {
                name: "Lithuania",
                dial_code: "+370",
                emoji: "🇱🇹",
                code: "LT"
            },
            {
                name: "Latvia",
                dial_code: "+371",
                emoji: "🇱🇻",
                code: "LV"
            },
            {
                name: "Estonia",
                dial_code: "+372",
                emoji: "🇪🇪",
                code: "EE"
            },
            {
                name: "Moldova",
                dial_code: "+373",
                emoji: "🇲🇩",
                code: "MD"
            },
            {
                name: "Armenia",
                dial_code: "+374",
                emoji: "🇦🇲",
                code: "AM"
            },
            {
                name: "Belarus",
                dial_code: "+375",
                emoji: "🇧🇾",
                code: "BY"
            },
            {
                name: "Andorra",
                dial_code: "+376",
                emoji: "🇦🇩",
                code: "AD"
            },
            {
                name: "Monaco",
                dial_code: "+377",
                emoji: "🇲🇨",
                code: "MC"
            },
            {
                name: "San Marino",
                dial_code: "+378",
                emoji: "🇸🇲",
                code: "SM"
            },
            {
                name: "Holy See (Vatican City State)",
                dial_code: "+379",
                emoji: "🇻🇦",
                code: "VA"
            },
            {
                name: "Ukraine",
                dial_code: "+380",
                emoji: "🇺🇦",
                code: "UA"
            },
            {
                name: "Serbia",
                dial_code: "+381",
                emoji: "🇷🇸",
                code: "RS"
            },
            {
                name: "Montenegro",
                dial_code: "+382",
                emoji: "🇲🇪",
                code: "ME"
            },
            {
                name: "Croatia",
                dial_code: "+385",
                emoji: "🇭🇷",
                code: "HR"
            },
            {
                name: "Slovenia",
                dial_code: "+386",
                emoji: "🇸🇮",
                code: "SI"
            },
            {
                name: "Bosnia and Herzegovina",
                dial_code: "+387",
                emoji: "🇧🇦",
                code: "BA"
            },
            {
                name: "Macedonia",
                dial_code: "+389",
                emoji: "🇲🇰",
                code: "MK"
            },
            {
                name: "Czech Republic",
                dial_code: "+420",
                emoji: "🇨🇿",
                code: "CZ"
            },
            {
                name: "Slovakia",
                dial_code: "+421",
                emoji: "🇸🇰",
                code: "SK"
            },
            {
                name: "Liechtenstein",
                dial_code: "+423",
                emoji: "🇱🇮",
                code: "LI"
            },
            {
                name: "Falkland Islands (Malvinas)",
                dial_code: "+500",
                emoji: "🇫🇰",
                code: "FK"
            },
            {
                name: "South Georgia and the South Sandwich Islands",
                dial_code: "+500",
                emoji: "🇬🇸",
                code: "GS"
            },
            {
                name: "Belize",
                dial_code: "+501",
                emoji: "🇧🇿",
                code: "BZ"
            },
            {
                name: "Guatemala",
                dial_code: "+502",
                emoji: "🇬🇹",
                code: "GT"
            },
            {
                name: "El Salvador",
                dial_code: "+503",
                emoji: "🇸🇻",
                code: "SV"
            },
            {
                name: "Honduras",
                dial_code: "+504",
                emoji: "🇭🇳",
                code: "HN"
            },
            {
                name: "Nicaragua",
                dial_code: "+505",
                emoji: "🇳🇮",
                code: "NI"
            },
            {
                name: "Costa Rica",
                dial_code: "+506",
                emoji: "🇨🇷",
                code: "CR"
            },
            {
                name: "Panama",
                dial_code: "+507",
                emoji: "🇵🇦",
                code: "PA"
            },
            {
                name: "Saint Pierre and Miquelon",
                dial_code: "+508",
                emoji: "🇵🇲",
                code: "PM"
            },
            {
                name: "Haiti",
                dial_code: "+509",
                emoji: "🇭🇹",
                code: "HT"
            },
            {
                name: "Guadeloupe",
                dial_code: "+590",
                emoji: "🇬🇵",
                code: "GP"
            },
            {
                name: "Saint Barthelemy",
                dial_code: "+590",
                emoji: "🇧🇱",
                code: "BL"
            },
            {
                name: "Saint Martin",
                dial_code: "+590",
                emoji: "🇲🇫",
                code: "MF"
            },
            {
                name: "Bolivia, Plurinational State of",
                dial_code: "+591",
                emoji: "🇧🇴",
                code: "BO"
            },
            {
                name: "Ecuador",
                dial_code: "+593",
                emoji: "🇪🇨",
                code: "EC"
            },
            {
                name: "French Guiana",
                dial_code: "+594",
                emoji: "🇬🇫",
                code: "GF"
            },
            {
                name: "Guyana",
                dial_code: "+595",
                emoji: "🇬🇾",
                code: "GY"
            },
            {
                name: "Paraguay",
                dial_code: "+595",
                emoji: "🇵🇾",
                code: "PY"
            },
            {
                name: "Martinique",
                dial_code: "+596",
                emoji: "🇲🇶",
                code: "MQ"
            },
            {
                name: "Suriname",
                dial_code: "+597",
                emoji: "🇸🇷",
                code: "SR"
            },
            {
                name: "Uruguay",
                dial_code: "+598",
                emoji: "🇺🇾",
                code: "UY"
            },
            {
                name: "Netherlands Antilles",
                dial_code: "+599",
                emoji: "🇧🇶",
                code: "AN"
            },
            {
                name: "Timor-Leste",
                dial_code: "+670",
                emoji: "🇹🇱",
                code: "TL"
            },
            {
                name: "Antarctica",
                dial_code: "+672",
                emoji: "🇦🇶",
                code: "AQ"
            },
            {
                name: "Norfolk Island",
                dial_code: "+672",
                emoji: "🇳🇫",
                code: "NF"
            },
            {
                name: "Brunei Darussalam",
                dial_code: "+673",
                emoji: "🇧🇳",
                code: "BN"
            },
            {
                name: "Nauru",
                dial_code: "+674",
                emoji: "🇳🇷",
                code: "NR"
            },
            {
                name: "Papua New Guinea",
                dial_code: "+675",
                emoji: "🇵🇬",
                code: "PG"
            },
            {
                name: "Tonga",
                dial_code: "+676",
                emoji: "🇹🇴",
                code: "TO"
            },
            {
                name: "Solomon Islands",
                dial_code: "+677",
                emoji: "🇸🇧",
                code: "SB"
            },
            {
                name: "Vanuatu",
                dial_code: "+678",
                emoji: "🇻🇺",
                code: "VU"
            },
            {
                name: "Fiji",
                dial_code: "+679",
                emoji: "🇫🇯",
                code: "FJ"
            },
            {
                name: "Palau",
                dial_code: "+680",
                emoji: "🇵🇼",
                code: "PW"
            },
            {
                name: "Wallis and Futuna",
                dial_code: "+681",
                emoji: "🇼🇫",
                code: "WF"
            },
            {
                name: "Cook Islands",
                dial_code: "+682",
                emoji: "🇨🇰",
                code: "CK"
            },
            {
                name: "Niue",
                dial_code: "+683",
                emoji: "🇳🇺",
                code: "NU"
            },
            {
                name: "Samoa",
                dial_code: "+685",
                emoji: "🇼🇸",
                code: "WS"
            },
            {
                name: "Kiribati",
                dial_code: "+686",
                emoji: "🇰🇮",
                code: "KI"
            },
            {
                name: "New Caledonia",
                dial_code: "+687",
                emoji: "🇳🇨",
                code: "NC"
            },
            {
                name: "Tuvalu",
                dial_code: "+688",
                emoji: "🇹🇻",
                code: "TV"
            },
            {
                name: "French Polynesia",
                dial_code: "+689",
                emoji: "🇵🇫",
                code: "PF"
            },
            {
                name: "Tokelau",
                dial_code: "+690",
                emoji: "🇹🇰",
                code: "TK"
            },
            {
                name: "Micronesia, Federated States of Micronesia",
                dial_code: "+691",
                emoji: "🇫🇲",
                code: "FM"
            },
            {
                name: "Marshall Islands",
                dial_code: "+692",
                emoji: "🇲🇭",
                code: "MH"
            },
            {
                name: "Korea, Democratic People's Republic of Korea",
                dial_code: "+850",
                emoji: "🇰🇵",
                code: "KP"
            },
            {
                name: "Hong Kong",
                dial_code: "+852",
                emoji: "🇭🇰",
                code: "HK"
            },
            {
                name: "Macao",
                dial_code: "+853",
                emoji: "🇲🇴",
                code: "MO"
            },
            {
                name: "Cambodia",
                dial_code: "+855",
                emoji: "🇰🇭",
                code: "KH"
            },
            {
                name: "Laos",
                dial_code: "+856",
                emoji: "🇱🇦",
                code: "LA"
            },
            {
                name: "Pitcairn",
                dial_code: "+872",
                emoji: "🇵🇳",
                code: "PN"
            },
            {
                name: "Bangladesh",
                dial_code: "+880",
                emoji: "🇧🇩",
                code: "BD"
            },
            {
                name: "Taiwan",
                dial_code: "+886",
                emoji: "🇹🇼",
                code: "TW"
            },
            {
                name: "Maldives",
                dial_code: "+960",
                emoji: "🇲🇻",
                code: "MV"
            },
            {
                name: "Lebanon",
                dial_code: "+961",
                emoji: "🇱🇧",
                code: "LB"
            },
            {
                name: "Jordan",
                dial_code: "+962",
                emoji: "🇯🇴",
                code: "JO"
            },
            {
                name: "Syrian Arab Republic",
                dial_code: "+963",
                emoji: "🇸🇾",
                code: "SY"
            },
            {
                name: "Iraq",
                dial_code: "+964",
                emoji: "🇮🇷",
                code: "IQ"
            },
            {
                name: "Kuwait",
                dial_code: "+965",
                emoji: "🇰🇼",
                code: "KW"
            },
            {
                name: "Saudi Arabia",
                dial_code: "+966",
                emoji: "🇸🇦",
                code: "SA"
            },
            {
                name: "Yemen",
                dial_code: "+967",
                emoji: "🇾🇪",
                code: "YE"
            },
            {
                name: "Oman",
                dial_code: "+968",
                emoji: "🇴🇲",
                code: "OM"
            },
            {
                name: "Palestinian Territory, Occupied",
                dial_code: "+970",
                emoji: "🇵🇸",
                code: "PS"
            },
            {
                name: "United Arab Emirates",
                dial_code: "+971",
                emoji: "🇦🇪",
                code: "AE"
            },
            {
                name: "Israel",
                dial_code: "+972",
                emoji: "🇮🇱",
                code: "IL"
            },
            {
                name: "Bahrain",
                dial_code: "+973",
                emoji: "🇧🇭",
                code: "BH"
            },
            {
                name: "Qatar",
                dial_code: "+974",
                emoji: "🇶🇦",
                code: "QA"
            },
            {
                name: "Bhutan",
                dial_code: "+975",
                emoji: "🇧🇹",
                code: "BT"
            },
            {
                name: "Mongolia",
                dial_code: "+976",
                emoji: "🇲🇳",
                code: "MN"
            },
            {
                name: "Nepal",
                dial_code: "+977",
                emoji: "🇳🇵",
                code: "NP"
            },
            {
                name: "Tajikistan",
                dial_code: "+992",
                emoji: "🇹🇯",
                code: "TJ"
            },
            {
                name: "Turkmenistan",
                dial_code: "+993",
                emoji: "🇹🇲",
                code: "TM"
            },
            {
                name: "Azerbaijan",
                dial_code: "+994",
                emoji: "🇦🇿",
                code: "AZ"
            },
            {
                name: "Georgia",
                dial_code: "+995",
                emoji: "🇬🇪",
                code: "GE"
            },
            {
                name: "Kyrgyzstan",
                dial_code: "+996",
                emoji: "🇰🇬",
                code: "KG"
            },
            {
                name: "Uzbekistan",
                dial_code: "+998",
                emoji: "🇺🇿",
                code: "UZ"
            },
            {
                name: "Bahamas",
                dial_code: "+1242",
                emoji: "🇧🇸",
                code: "BS"
            },
            {
                name: "Barbados",
                dial_code: "+1246",
                emoji: "🇧🇧",
                code: "BB"
            },
            {
                name: "Anguilla",
                dial_code: "+1264",
                emoji: "🇦🇮",
                code: "AI"
            },
            {
                name: "Antigua and Barbuda",
                dial_code: "+1268",
                emoji: "🇦🇬",
                code: "AG"
            },
            {
                name: "Virgin Islands, British",
                dial_code: "+1284",
                emoji: "🇻🇬",
                code: "VG"
            },
            {
                name: "Virgin Islands, U.S.",
                dial_code: "+1340",
                emoji: "🇻🇮",
                code: "VI"
            },
            {
                name: "Bermuda",
                dial_code: "+1441",
                emoji: "🇧🇲",
                code: "BM"
            },
            {
                name: "Grenada",
                dial_code: "+1473",
                emoji: "🇬🇩",
                code: "GD"
            },
            {
                name: "Turks and Caicos Islands",
                dial_code: "+1649",
                emoji: "🇹🇨",
                code: "TC"
            },
            {
                name: "Montserrat",
                dial_code: "+1664",
                emoji: "🇲🇸",
                code: "MS"
            },
            {
                name: "Northern Mariana Islands",
                dial_code: "+1670",
                emoji: "🇲🇵",
                code: "MP"
            },
            {
                name: "Guam",
                dial_code: "+1671",
                emoji: "🇬🇺",
                code: "GU"
            },
            {
                name: "AmericanSamoa",
                dial_code: "+1684",
                emoji: "🇦🇸",
                code: "AS"
            },
            {
                name: "Saint Lucia",
                dial_code: "+1758",
                emoji: "🇱🇨",
                code: "LC"
            },
            {
                name: "Dominica",
                dial_code: "+1767",
                emoji: "🇩🇲",
                code: "DM"
            },
            {
                name: "Saint Vincent and the Grenadines",
                dial_code: "+1784",
                emoji: "🇻🇨",
                code: "VC"
            },
            {
                name: "Dominican Republic",
                dial_code: "+1849",
                emoji: "🇩🇴",
                code: "DO"
            },
            {
                name: "Trinidad and Tobago",
                dial_code: "+1868",
                emoji: "🇹🇹",
                code: "TT"
            },
            {
                name: "Saint Kitts and Nevis",
                dial_code: "+1869",
                emoji: "🇰🇳",
                code: "KN"
            },
            {
                name: "Jamaica",
                dial_code: "+1876",
                emoji: "🇯🇲",
                code: "JM"
            },
            {
                name: "Puerto Rico",
                dial_code: "+1939",
                emoji: "🇵🇷",
                code: "PR"
            }
        ]

    }
}

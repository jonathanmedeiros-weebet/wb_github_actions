import { Injectable } from '@angular/core';

import { ParametrosLocaisService } from '../parametros-locais.service';
import * as sportIds from '../../../shared/constants/sports-ids';

@Injectable({
	providedIn: 'root'
})
export class SportIdService {

    public footballId: Number;
    public boxingId: Number;
    public volleyballId: Number;
    public tennisId: Number;
    public basketballId: Number;
    public americanFootballId: Number;
    public tableTennisId: Number;
    public futsalId: Number;
    public iceHockeyId: Number;
    public eSportsId: Number;

    private lsportsSports = [
        sportIds.LSPORTS_FOOTBALL_ID,
        sportIds.LSPORTS_BASKETBALL_ID,
        sportIds.LSPORTS_BOXING_ID,
        sportIds.LSPORTS_VOLLEYBALL_ID,
        sportIds.LSPORTS_TENNIS_ID
    ];

    private betsapiSports = [
        sportIds.BETSAPI_FOOTBALL_ID,
        sportIds.BETSAPI_BOXING_ID,
        sportIds.BETSAPI_VOLLEYBALL_ID,
        sportIds.BETSAPI_TENNIS_ID,
        sportIds.BETSAPI_BASKETBALL_ID,
        sportIds.BETSAPI_AMERICAN_FOOTBALL_ID,
        sportIds.BETSAPI_TABLE_TENNIS_ID,
        sportIds.BETSAPI_FUTSAL_ID,
        sportIds.BETSAPI_ICE_HOCKEY_ID,
        sportIds.BETSAPI_E_SPORTS_ID
    ];

	constructor(private paramsService: ParametrosLocaisService) {
        switch (this.paramsService.getOpcoes().sportbook) {
            case 'lsports':
                this.footballId = sportIds.LSPORTS_FOOTBALL_ID;
                this.boxingId = sportIds.LSPORTS_BOXING_ID;
                this.volleyballId = sportIds.LSPORTS_VOLLEYBALL_ID;
                this.tennisId = sportIds.LSPORTS_TENNIS_ID;
                break;
            case 'betsapi':
            default:
                this.footballId = sportIds.BETSAPI_FOOTBALL_ID;
                this.boxingId = sportIds.BETSAPI_BOXING_ID;
                this.volleyballId = sportIds.BETSAPI_VOLLEYBALL_ID;
                this.tennisId = sportIds.BETSAPI_TENNIS_ID;
                break;
        }

        this.basketballId = sportIds.LSPORTS_BASKETBALL_ID;
        this.americanFootballId = sportIds.BETSAPI_AMERICAN_FOOTBALL_ID;
        this.tableTennisId = sportIds.BETSAPI_TABLE_TENNIS_ID;
        this.futsalId = sportIds.BETSAPI_FUTSAL_ID;
        this.iceHockeyId = sportIds.BETSAPI_ICE_HOCKEY_ID;
        this.eSportsId = sportIds.BETSAPI_E_SPORTS_ID;
	}

    public sportIdByName(name: String): Number {
        switch (name) {
            case 'football':
                return this.footballId;
            case 'volleyball':
                return this.volleyballId;
            case 'tennis':
                return this.tennisId;
            case 'boxing':
                return this.boxingId;
            case 'basketball':
                return this.basketballId;
            case 'americanFootball':
                return this.americanFootballId;
            case 'tableTennis':
                return this.tableTennisId;
            case 'futsal':
                return this.futsalId;
            case 'iceHockey':
                return this.iceHockeyId;
            case 'eSports':
                return this.eSportsId;
            default:
                return 0;
        }
    }

    public teamShieldsFolder(sportId?) {
        if (!sportId) {
            switch (this.paramsService.getOpcoes().sportbook) {
                case 'lsports':
                    return 'times_v2';
                case 'betsapi':
                    return 'times';
            }
        } else {
            if (this.lsportsSports.includes(sportId)) {
                return 'times_v2';
            } else if (this.betsapiSports.includes(sportId)) {
                return 'times';
            }
        }

        return 'times';
    }
}

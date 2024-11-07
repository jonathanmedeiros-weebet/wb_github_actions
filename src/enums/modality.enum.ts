export enum ModalitiesLSport {
    FOOTBALL = 6046,
    COMBAT = 154919,
    AMERICAN_FOOTBALL = 12, //betsapi
    TENNIS = 54094,
    ICE_HOCKEY = 17, //betsapi
    BASKETBALL = 48242,
    FUTSAL = 83, //betsapi
    VOLLEYBALL = 154830,
    TABLE_TENNIS = 92, //betsapi
    E_SPORTS = 151, //betsapi
    CHALLENGE = 'null1',
    ACCUMULATION = 'null2',
    POPULAR_LOTTERY = 'null3',
};

export enum ModalitiesBetsApi {
    FOOTBALL = 1,
    COMBAT = 9,
    AMERICAN_FOOTBALL = 12,
    TENNIS = 13,
    ICE_HOCKEY = 17,
    BASKETBALL = 18,
    FUTSAL = 83,
    VOLLEYBALL = 91,
    TABLE_TENNIS = 92,
    E_SPORTS = 151,
    CHALLENGE = 'null1',
    ACCUMULATION = 'null2',
    POPULAR_LOTTERY = 'null3',
};

export type Modalities = ModalitiesBetsApi | ModalitiesLSport;
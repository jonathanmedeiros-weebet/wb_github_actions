<template>
    <div class="table">
        <Header title="Tabela" :showBackButton="true" />

        <div class="table__container">
            <w-input
                type="text"
                name="championshipname"
                v-model="tableChampionshipName"
                placeholder="Pesquisar"
            >
                <template #icon>
                    <IconSearch :size="20" :color="useHexColors"/>
                </template>
            </w-input>

            <div class="table__container-list">
                <ul>
                    <li class="table__select-all">
                        <label>
                            <input 
                                id="select-all" 
                                class="checkbox" 
                                type="checkbox"
                                @click="handleSelectAll"    
                            >
                            Selecionar todos de {{ formatedDate }}
                        </label>
                        <ul v-show="championshipList.length">
                            <i class="table__container-list-icon"></i>
                            <li
                                v-for="(championship, index) in championshipList"
                                class="table__list-item"
                                :key="index"
                            >
                                <label>
                                    <input 
                                        class="checkbox checkbox-item"
                                        :value="championship._id"
                                        type="checkbox"
                                        @change="updateSelectedChampionships"
                                    >
                                    {{ championship.nome }}
                                </label>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div class="buttons">
                <w-button
                    text="Imprimir"
                    class="button__confirm"
                    @click="handlePrint"
                >
                </w-button>
            </div>
        </div>
    </div>
</template>

<script>
import WInput from '@/components/Input.vue';
import Header from '@/components/layouts/Header.vue';
import WButton from '@/components/Button.vue';
import { dateFormatInDayAndMonthAndYearBR, now } from "@/utilities";
import { ToastType } from '@/enums';
import { useHomeStore, useToastStore } from '@/stores';
import { getChampionshipBySportId, printTable } from '@/services';
import IconSearch from '@/components/icons/IconSearch.vue';
import { getOddsToPrint, isAndroid5 } from '../utilities/general.utility';
import { getModalitiesEnum } from '@/constants';

export default {
    name: 'table',
    components: {
        Header,
        WInput,
        WButton,
        IconSearch
    },
    data() {
        return {
            tableChampionshipName: '',
            toastStore: useToastStore(),
            homeStore: useHomeStore(),
            today: now(),
            oddsToPrint: [],
            championships: [],
            selectedChampionships: []
        };
    },
    computed: {
        championshipList() {
            if(!Boolean(this.tableChampionshipName)) return this.championships;
            return this.championships.filter(championship => (championship.nome.toLowerCase()).includes(this.tableChampionshipName.toLowerCase()))
        },
        formatedDate() {
            const date = dateFormatInDayAndMonthAndYearBR(this.today);
            return date;
        },
        useHexColors() {
            return isAndroid5() ? 'rgba(255, 255, 255, .5)' : 'rgba(var(--input-foreground-rgb), .5)';
        }
    }, 
    methods: {
        async fetchOddsToPrint() {
            this.oddsToPrint = await getOddsToPrint();
        },
        async fetchChampionships() {
            if (this.oddsToPrint.length) {
                const modalities = getModalitiesEnum();
                const currentDate = now().format('YYYY-MM-DD');
                
                await getChampionshipBySportId(
                    modalities.FOOTBALL,
                    '',
                    currentDate,
                    false,
                    this.oddsToPrint
                )
                .then((campeonatos) => this.championships = campeonatos)
                .catch(error => {
                    console.error(error)
                    this.toastStore.setToastConfig({
                        message: 'Ocorreu algum erro ao buscar os campeonatos.',
                        type: ToastType.DANGER,
                        duration: 5000
                    })
                })
            }
        },
        async handlePrint() {
            if (!this.selectedChampionships.length) {
                this.toastStore.setToastConfig({
                    message: 'Por favor, selecione ao menos um campeonato.',
                    type: ToastType.DANGER,
                    duration: 5000
                })
                return;
            }

            printTable(this.selectedChampionships);
        },
        handleSelectAll() {
            const selectAll = document.getElementById('select-all');
            const checkboxes = document.querySelectorAll('.checkbox-item');

            if (selectAll.checked) {
                this.selectedChampionships = [...this.championshipList];
            } else {
                this.selectedChampionships = [];
            }

            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAll.checked;
            });
        },
        updateSelectedChampionships(event) {
            const selectedId = event.target.value;

            if (event.target.checked) {
                if (!this.selectedChampionships.some(champ => champ._id === selectedId)) {
                    const selectedChampionship = this.championshipList.find(champ => champ._id === selectedId);
                    if (selectedChampionship) {
                        this.selectedChampionships.push(selectedChampionship);
                    }
                }
            } else {
                this.selectedChampionships = this.selectedChampionships.filter(champ => champ._id !== selectedId);
            }
        }
    },
    async activated() {
        await this.fetchOddsToPrint();
        this.fetchChampionships();
    }
}
</script>

<style lang="scss" scoped>
.table {
    color: var(--foreground);
    height: auto;
    width: 100%;
    padding-bottom: 100px;

    ul {
        padding: 0;
        list-style: none;

        li {
            list-style: none;

            label {
                display: flex;
                align-items: center;
                margin: 0;

                input {
                    margin-right: 10px;
                }
            }

            ul {
                position: relative;

                li {
                    padding-left: 40px;
                    margin: 10px 0;

                    &::before {
                        position: absolute;
                        height: 0;
                        left: 8px;
                        width: 22px;
                        content: "";
                        display: block;
                        margin-top: 10px;
                        border-top: 0.5px dashed var(--highlight);
                    }
                }
            }
        }
    }

    &__container {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0 20px;
        padding-top: 20px;

        &-itens {
            margin: 20px 0;
        }

        &-list {
            margin-top: 1rem;

            &-icon {
                display: block;
                bottom: 0;
                top: 0;
                left: 8px;
                position: absolute;
                height: calc(100% - 10px);
                content: "";
                border: 0.5px dashed var(--highlight);
            }
        }
    }

    &__text {
        color: var(--foreground); 
        font-size: 14px;
    }
}

.buttons {
    display: flex;
    align-items: center;
    padding-top: 25px;
}

.button-spacer {
    width: 20px; 
}

.checkbox {
    position: relative;
    width: 16px;
    height: 16px;
    color: black;
    border: 1px solid var(--highlight);
    border-radius: 4px;
    -webkit-appearance: none;
    appearance: none;
    outline: 0;
    cursor: pointer;
    transition: background 175ms cubic-bezier(0.1, 0.1, 0.25, 1);

    &:checked {
        background-color: var(--highlight);
    }

    &::before {
        position: absolute;
        content: '';
        display: block;
        top: 2px;
        left: 2px;
        width: 10px;
        height: 10px;
        background: var(--highlight);
        border-radius: 4px;
        opacity: 0;
    }
}
</style>

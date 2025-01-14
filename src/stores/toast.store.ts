import { ToastType } from "@/enums";
import type { ToastParams } from "@/interfaces";
import { defineStore } from "pinia"

export const useToastStore = defineStore('toast', {
    state: (): ToastParams => ({
        message: '',
        type: ToastType.WARNING,
        duration: 3000,
    }),
    actions: {
        setToastConfig({ message, type, duration }: ToastParams) {
            if(message != undefined) {
                this.message = message;
            }

            if(Boolean(type)) {
                this.type = type;
            }

            if(Boolean(duration)) {
                this.duration = duration;
            }
        },
    },
})
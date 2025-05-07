import { AfterViewInit, Component, Input, QueryList, Type, ViewChildren, ViewContainerRef } from '@angular/core';
import { IconAssuredWorkloadComponent } from '../../../icons/icon-assured-workload';
import { IconVerifiedUserComponent } from '../../../icons/icon-verified-user';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generic-information-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-information-steps.component.html',
  styleUrl: './generic-information-steps.component.scss'
})
export class GenericInformationStepsComponent implements AfterViewInit {

// @Input() data: any; 

//   public infoData :any = [

//     {
//       title: 'Jogando com a regra',
//       items: [
//         {
//           text: 'Como cumprimento da legislação, precisamos realizar essa etapa de validação',
//           icon: IconAssuredWorkloadComponent,
//         },
//         {
//           text: 'Essa medida garante mais segurança para você em nossa plataforma!',
//           icon: IconVerifiedUserComponent,
//         }
//       ]
//     }
    
//   ]


  @Input() sections: {
    title: string;
    items: {
      text: string;
      icon: Type<any>;
      iconProps?: Record<string, any>;
    }[];
  }[] = [];
  @ViewChildren('iconContainer', { read: ViewContainerRef })
  iconContainers!: QueryList<ViewContainerRef>;
  constructor(private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngAfterViewInit() {
    let i = 0;
    for (const section of this.sections) {
      console.log(section);
      for (const item of section.items) {
        console.log(item);
        const container = this.iconContainers.get(i++);
        if (container) {
          console.log(container);
          const compRef = container.createComponent(item.icon);
          if (item.iconProps) {
            console.log(item.iconProps);
            Object.assign(compRef.instance, item.iconProps);
          }
        }
      }
    }
  }

}

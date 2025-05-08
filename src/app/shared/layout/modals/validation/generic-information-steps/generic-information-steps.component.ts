import { AfterViewInit, Component, Input, QueryList, Type, ViewChildren, ViewContainerRef } from '@angular/core';
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
 @Input() textButton: string;
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

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  get hasButton(): boolean {
    return Boolean(this.textButton);
  }

  ngAfterViewInit() {
    let i = 0;
    for (const section of this.sections) {
      for (const item of section.items) {
        const container = this.iconContainers.get(i++);
        if (container) {
          const compRef = container.createComponent(item.icon);
          if (item.iconProps) {
            Object.assign(compRef.instance, item.iconProps);
          }
        }
      }
    }
  }

}

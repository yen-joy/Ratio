import { trigger, state, style, transition,
  animate, group
} from '@angular/animations';

export const SlideInOutAnimation = [
  trigger('slideInOut', [
    state('in', style({
      'max-width': '500px', 'opacity': '1', 'visibility': 'visible', 'padding': '0rem', 'padding-top': '0'
    })),
    state('out', style({
      'max-width': '0px', 'opacity': '0', 'visibility': 'hidden' , 'padding': '0rem', 'padding-top': '0'
    })),
    transition('in => out', [group([
        animate('400ms ease-in-out', style({
          'opacity': '0'
        })),
        animate('600ms ease-in-out', style({
          'max-width': '0px'
        })),
        animate('700ms ease-in-out', style({
          'visibility': 'hidden'
        })),
        animate('700ms ease-in-out', style({
          'padding': '0rem', 'padding-top': '0'
        }))
      ]
    )]),
    transition('out => in', [group([
        animate('1ms ease-in-out', style({
          'visibility': 'visible'
        })),
        animate('600ms ease-in-out', style({
          'max-width': '500px'
        })),
        animate('800ms ease-in-out', style({
          'opacity': '1'
        })),
        animate('700ms ease-in-out', style({
          'padding': '0rem', 'padding-top': '0'
        }))
      ]
    )])
  ]),
]

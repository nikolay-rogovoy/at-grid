import {Pipe} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Pipe({name: 'safeHtml'})
export class SafeHtml {
  constructor(private sanitizer: DomSanitizer){}

  transform(html: string): SafeResourceUrl {
    //return this.sanitizer.bypassSecurityTrustHtml(html);
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'values' })
export class ValuesPipe implements PipeTransform {
    transform(value: any): any[] {
        let result: any[] = [];

        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                result.push({ key: key, value: value[key] });
            }
        }

        return result;
    }
}

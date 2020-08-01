import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'carTypeFilter'
})
export class CarTypeFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, property: string): any[] {
    if (!items)  // if there is no list to filter
      return [];
    if (!searchText)  //if there is no filter
      return items;
    searchText = searchText.toLowerCase();
    if (property == 'TypeId') {
      let search: string[] = [];
      search.push(searchText);
      if (searchText.includes(', ')) {
        search = searchText.split(', ');
        return items.filter(it => { return it['Model'].toLowerCase().includes(search[1]); });
      }
      return items.filter(it => { return it['Manufacturer'].toLowerCase().includes(search[0]); });
    }
    return items.filter(it => { return it[property].toLowerCase().includes(searchText); });
  }
}

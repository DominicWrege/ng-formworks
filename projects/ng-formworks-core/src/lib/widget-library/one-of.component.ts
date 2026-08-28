import { Component, inject, input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { deepEqual, pick } from '../shared/native.functions';
import type { FormValue, LayoutNode, WidgetOptions } from '../shared/types';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { hasNonNullValue, hasOwn, isObject, JsonPointer, path2ControlKey } from '../shared';
import { TabsComponent } from './tabs.component';

// TODO: Add this control

@Component({
    imports: [TabsComponent],
    selector: 'one-of-widget',
    templateUrl: './one-of.component.html',
})
export class OneOfComponent implements OnInit {
  private jsf = inject(JsonSchemaFormService);

  formControl!: AbstractControl;
  controlName!: string;
  controlValue: FormValue;
  controlDisabled = false;
  boundControl = false;
  options!: WidgetOptions;
  readonly layoutNode = input<LayoutNode | undefined>(undefined);
  readonly layoutIndex = input<number[] | undefined>(undefined);
  readonly dataIndex = input<number[] | undefined>(undefined);

  ngOnInit() {
    this.options = this.layoutNode()!.options || {};
    this.options.tabMode="oneOfMode";
    this.options.selectedTab=this.findSelectedTab();
    this.jsf.initializeControl(this);
  }

    findSelectedTab(){
        // TODO(test): jsf.formValues is the initial data supplied to the form,
        //while the jsf.formGroup value is derived from the actual controls
        let foundInd=-1;
        //search for non null value
        if(this.layoutNode()!.items){
          this.layoutNode()!.items!.forEach((layoutItem,ind)=>{
            let formValue=JsonPointer.get(this.jsf.formValues,layoutItem.dataPointer);
              if(layoutItem.oneOfPointer){
                let controlKey=path2ControlKey(layoutItem.oneOfPointer);
                let fname=layoutItem.name;
                if(hasOwn(this.jsf.formGroup!.controls,controlKey)&&
                  (formValue || hasNonNullValue(this.jsf.formGroup!.controls[controlKey].value))
                  //hasOwn(formValue,fname) && hasOwn(this.jsf.formGroup.controls,controlKey) 
                // && (formValue[fname] || this.jsf.formGroup.controls[controlKey].value)
                  //&&deepEqual(formValue[fname],this.jsf.formGroup.controls[controlKey].value)
                ){
                    foundInd=ind;
                }
                //foundInd=formValue[controlKey]!=null?ind:foundInd;
                //if no exact match found, then search in descendant values
                //to see which one of item matches
                if(foundInd==-1){
                  //find all descendant oneof paths
                  let descendantOneOfControlNames=Object.keys(this.jsf.formGroup!.controls).filter(controlName=>{
                    return controlName.startsWith(controlKey);
                  })
                  descendantOneOfControlNames.forEach(controlName=>{
                    let parts=controlName.split('$');
                    let fieldName=parts[parts.length-1];
                    let controlValue=this.jsf.formGroup!.controls[controlName].value;
                    let controlSchema=JsonPointer.get(this.jsf.schema,parts.join("/"));
                    let schemaPointer=parts.join("/");
                    let dPointer=schemaPointer.replace(/(anyOf|allOf|oneOf|none)\/[\d]+\//g, '')
                    .replace(/(if|then|else|properties)\//g, '').replace(/\/items\//g,'/-/');
                    let dVal=JsonPointer.get(this.jsf.formValues,dPointer);
                    let compareVal=dVal;
                    //compare only values that are in the subschema properties
                    if(controlSchema && controlSchema.properties){
                      compareVal=isObject(dVal) && hasOwn(dVal,fieldName)?
                      pick(dVal[fieldName],Object.keys(controlSchema.properties))
                      :pick(dVal,Object.keys(controlSchema.properties))
                    }
                    /*
                    if(isObject(compareVal) && hasOwn(compareVal,fieldName) && 
                    deepEqual(compareVal[fieldName],controlValue)
                  ){
                      foundInd=ind;
                    }else //if(formValue || controlValue){
                    if(deepEqual(compareVal,controlValue)){
                      foundInd=ind;
                    }
                    */
                    if(deepEqual(compareVal,controlValue)){
                      foundInd=ind;
                    }
                  })
                  //now need to compare values
                }
              }
          })
        }
        return Math.max(foundInd,0);
      }

  updateValue(event: { target: { value: string | null } }) {
    this.jsf.updateValue(this, event.target.value);
  }
}

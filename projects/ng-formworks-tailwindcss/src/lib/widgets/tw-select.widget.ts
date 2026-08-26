import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SelectComponent } from '@ng-formworks/core';
import { injectTw, twLabelCls, twFieldCls } from '../tw-base';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tw-select-widget',
    template: `
    <div
      [class]="options?.htmlClass || tw.formGroup">
      @if (options?.title) {
        <label
          [attr.for]="'control' + layoutNode()?._id"
          [class]="labelCls(options)"
          [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="$safeNavigationMigration(options?.title)"></label>
      }
      @if (boundControl && !options?.multiple) {
        <select
          [formControl]="formControl"
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.readonly]="options?.readonly ? 'readonly' : null"
          [attr.required]="options?.required"
          [class]="fieldCls(options, formControl)"
          [id]="'control' + $safeNavigationMigration(layoutNode()?._id)"
          [name]="controlName">
          @for (selectItem of selectList; track selectItem) {
            @if (!isArray($safeNavigationMigration(selectItem?.items))) {
              <option
                [ngValue]="$safeNavigationMigration(selectItem?.value)">
                <span [innerHTML]="$safeNavigationMigration(selectItem?.name)"></span>
              </option>
            }
            @if (isArray($safeNavigationMigration(selectItem?.items))) {
              <optgroup
                [label]="$safeNavigationMigration(selectItem?.group)">
                @for (subItem of selectItem.items; track subItem) {
                  <option
                    [ngValue]="$safeNavigationMigration(subItem?.value)">
                    <span [innerHTML]="$safeNavigationMigration(subItem?.name)"></span>
                  </option>
                }
              </optgroup>
            }
          }
        </select>
      }
      @if (!boundControl) {
        <select
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.readonly]="options?.readonly ? 'readonly' : null"
          [attr.required]="options?.required"
          [class]="fieldCls(options)"
          [disabled]="controlDisabled"
          [id]="'control' + $safeNavigationMigration(layoutNode()?._id)"
          [name]="controlName"
          (change)="updateValue($event)">
          @for (selectItem of selectList; track selectItem) {
            @if (!isArray($safeNavigationMigration(selectItem?.items))) {
              <option
                [selected]="selectItem?.value === controlValue"
                [ngValue]="$safeNavigationMigration(selectItem?.value)">
                <span [innerHTML]="$safeNavigationMigration(selectItem?.name)"></span>
              </option>
            }
            @if (isArray($safeNavigationMigration(selectItem?.items))) {
              <optgroup
                [label]="$safeNavigationMigration(selectItem?.group)">
                @for (subItem of selectItem.items; track subItem) {
                  <option
                    [attr.selected]="subItem?.value === controlValue"
                    [ngValue]="$safeNavigationMigration(subItem?.value)">
                    <span [innerHTML]="$safeNavigationMigration(subItem?.name)"></span>
                  </option>
                }
              </optgroup>
            }
          }
        </select>
      }
      @if (boundControl && options?.multiple) {
        <select
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.readonly]="options?.readonly ? 'readonly' : null"
          [attr.required]="options?.required"
          [class]="fieldCls(options, formControl)"
          [disabled]="controlDisabled"
          [id]="'control' + $safeNavigationMigration(layoutNode()?._id)"
          [multiple]="$safeNavigationMigration(options?.multiple)"
          [name]="controlName"
          [(ngModel)]="controlValue"
          (change)="updateValue($event)">
          @for (selectItem of selectList; track selectItem) {
            @if (!isArray($safeNavigationMigration(selectItem?.items))) {
              <option
                [selected]="selectItem?.value === controlValue"
                [ngValue]="$safeNavigationMigration(selectItem?.value)">
                <span [innerHTML]="$safeNavigationMigration(selectItem?.name)"></span>
              </option>
            }
            @if (isArray($safeNavigationMigration(selectItem?.items))) {
              <optgroup
                [label]="$safeNavigationMigration(selectItem?.group)">
                @for (subItem of selectItem.items; track subItem) {
                  <option
                    [attr.selected]="subItem?.value === controlValue"
                    [ngValue]="$safeNavigationMigration(subItem?.value)">
                    <span [innerHTML]="$safeNavigationMigration(subItem?.name)"></span>
                  </option>
                }
              </optgroup>
            }
          }
        </select>
      }
    </div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TwSelectComponent extends SelectComponent {
  readonly tw = injectTw();
  labelCls(options: any) { return twLabelCls(this.tw, options); }
  fieldCls(options: any, fc?: any) { return twFieldCls(this.tw, options, 'select', fc); }
}

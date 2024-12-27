declare module "vue-draggable-resizable" {
  import { DefineComponent } from "vue";
  interface DraggableResizableOptions {
    resizable?: boolean;
    w?: number | string;
    h?: number | string;
    x?: number;
    y?: number;
    className: string;
  }

  const VueDraggableResizable: DefineComponent<DraggableResizableOptions>;
  export default VueDraggableResizable;
}

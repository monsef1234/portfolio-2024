declare module 'vue-simple-context-menu' {
    import { DefineComponent } from 'vue';

    interface ContextMenuOptions {
        name: string;
    }

    interface VueSimpleContextMenuProps {
        options: ContextMenuOptions[]; 
        elementId: string;             
        ref?: string;
        onOptionClicked?: (event: any) => void; 
    }

    const VueSimpleContextMenu: DefineComponent<VueSimpleContextMenuProps>;
    export default VueSimpleContextMenu;
}

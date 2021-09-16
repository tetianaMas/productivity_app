import './modal.less';
import { ModalController } from './MVC/modalController';
import { ModalView } from './MVC/modalView';

export const modalView = new ModalView();
export const modalController = new ModalController(modalView);

import './modal.scss';

export default function Modal({children, active}) {
  return (
    <div className="modal" style={active ? {display: 'block'} : {display: 'none'}}>
        <div className="modal__content">
            {children}
        </div>
    </div>
  )
}
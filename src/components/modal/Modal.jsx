export default function Modal({children, active}) {
  return (
    <div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/[0.5]" style={active ? {display: 'block'} : {display: 'none'}}>
        <div className="bg-darkgray p-[24px] w-fit max-h-[70vh] max-w-[70vw] overflow-y-auto absolute centered">
            {children}
        </div>
    </div>
  )
}
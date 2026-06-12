'use client'

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Xác nhận', 
  cancelText = 'Hủy', 
  isDestructive = true 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#111111]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8 text-center">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-[#F8F5E4] text-[#D45A2A]'}`}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isDestructive ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </div>
          <h3 className="font-heading font-bold text-xl text-[#111111] mb-2">{title}</h3>
          <p className="text-[#555555] text-[15px] leading-relaxed">{message}</p>
        </div>
        <div className="flex border-t border-[#E8E2D2]">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-4 text-[#555555] font-bold hover:bg-[#FAFAFA] transition-colors border-r border-[#E8E2D2]"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-4 font-bold transition-colors ${
              isDestructive ? 'text-red-600 hover:bg-red-50' : 'text-[#D45A2A] hover:bg-[#F8F5E4]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

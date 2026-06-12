import { getAmenityIcon } from '@/components/icons/AmenityIcons'

export default function AmenitiesSection({ amenities, section }) {
  if (!amenities || amenities.length === 0) return null

  return (
    <section id="amenities" className="py-20 md:py-28">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-[#BE4F24] uppercase tracking-[0.2em] mb-3">
            Tiện ích sân
          </p>
          <h2 className="font-heading text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-3">
            {section?.title || 'Tiện ích'}
          </h2>
          <p className="text-[#555555] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {section?.subtitle || 'Đầy đủ tiện nghi cho trải nghiệm tốt nhất'}
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 max-w-5xl mx-auto">
          {amenities.map((amenity, index) => (
            <div
              key={amenity.id}
              className="group relative bg-[#FFFDF6] rounded-2xl p-5 md:p-6 text-center border border-[#E8E2D2] hover:border-[#BE4F24]/25 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(190,79,36,0.08)] hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="mx-auto w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#F8F5E4] group-hover:bg-[#BE4F24]/8 flex items-center justify-center mb-4 transition-colors duration-300">
                <div className="w-6 h-6 md:w-7 md:h-7 text-[#BE4F24]">
                  {getAmenityIcon(amenity.icon)}
                </div>
              </div>

              {/* Name */}
              <h3 className="font-semibold text-[13.5px] md:text-[14px] text-[#111111] leading-snug mb-1.5">
                {amenity.name}
              </h3>

              {/* Description */}
              {amenity.description && (
                <p className="text-[11.5px] md:text-xs text-[#888888] leading-relaxed hidden md:block">
                  {amenity.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

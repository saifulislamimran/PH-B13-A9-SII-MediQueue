import { motion } from 'framer-motion';

/**
 * TutorCard component represents a single medical tutor.
 * It animates smoothly when it scrolls into view and provides hover scale micro-animations.
 */
export default function TutorCard({ tutor, onBook }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group bg-white dark:bg-slate-800 rounded-3xl p-6 tutor-card-shadow border border-outline-variant/30 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/30 h-full flex flex-col"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/10 shrink-0 relative bg-primary/5 flex items-center justify-center">
          {tutor.image ? (
            <img alt={tutor.name} className="w-full h-full object-cover" src={tutor.image} />
          ) : (
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-4xl">person</span>
          )}
        </div>
        <div>
          <h3 className="font-title-md text-title-md font-bold text-gray-900 dark:text-gray-100">
            {tutor.name}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 font-semibold">
            {tutor.institution}
          </p>
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined text-sm fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="font-label-md text-label-md ml-1 font-semibold">
              {tutor.rating} ({tutor.reviewsCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tutor.subjects.map((sub, idx) => (
          <span
            key={idx}
            className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full text-xs font-semibold"
          >
            {sub}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
        {tutor.description}
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-outline-variant/30 dark:border-slate-700 mt-auto">
        <span className="font-title-md text-title-md font-bold text-gray-900 dark:text-gray-100">
          ${tutor.price}
          <span className="text-gray-500 dark:text-gray-400 text-label-md font-normal">/hr</span>
        </span>
        <button
          onClick={() => onBook(tutor.id)}
          className="px-6 py-2.5 bg-primary text-on-secondary dark:bg-primary-container dark:text-on-primary-container rounded-xl font-label-md text-label-md font-semibold hover:opacity-90 transition-all active:scale-95"
        >
          Book Session
        </button>
      </div>
    </motion.div>
  );
}

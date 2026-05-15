import { HistoryTimeline } from '@/types/content';
import { Link } from 'react-router-dom';

interface TimelineProps {
  items: HistoryTimeline[];
}

export const Timeline = ({ items }: TimelineProps) => {
  return (
    <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-forest-leaf/0 before:via-forest-leaf/50 before:to-forest-leaf/0">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
        >
          {/* Dot */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-forest-leaf bg-white text-forest-leaf shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2 md:translate-x-0 z-10 transition-transform group-hover:scale-125 duration-300">
            <span className="font-bold text-xs">{item.year}</span>
          </div>

          {/* Content Card */}
          <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-2xl bg-white border border-basalt-soil/5 shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-headline-md text-xl text-basalt-soil leading-tight">
                  {item.title}
                </h3>
                <span className="text-forest-leaf font-bold italic text-lg">{item.year}</span>
              </div>

              <p className="text-on-surface-variant text-sm leading-relaxed">{item.description}</p>

              {item.imageUrl && (
                <div className="relative h-48 rounded-xl overflow-hidden mt-2">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}

              {item.locationName && (
                <div className="flex items-center gap-2 text-xs text-outline font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-leaf" />
                  {item.locationName}
                </div>
              )}

              {item.relatedPost && (
                <Link
                  to={`/posts/${item.relatedPost.id}`}
                  className="mt-2 p-3 bg-mist-beige rounded-xl border border-basalt-soil/5 flex items-center gap-3 hover:bg-forest-leaf/5 transition-colors group/link"
                >
                  {item.relatedPost.thumbnail && (
                    <img
                      src={item.relatedPost.thumbnail}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-forest-leaf font-bold">
                      Bài viết liên quan
                    </p>
                    <p className="text-sm font-semibold text-basalt-soil truncate group-hover/link:text-forest-leaf">
                      {item.relatedPost.title}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

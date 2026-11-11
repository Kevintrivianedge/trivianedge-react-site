import React, { useId, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';

interface ServiceVideoProps {
  videoId: string;
  title: string;
  description: string;
  duration: string;
}

export default function ServiceVideo({ videoId, title, description, duration }: ServiceVideoProps) {
  const headingId = useId();
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <section aria-labelledby={headingId} className="grid items-center gap-6 rounded-3xl border border-border bg-surface p-5 md:grid-cols-2 md:gap-8 md:p-8">
      <div>
        <h2 id={headingId} className="text-2xl font-semibold text-text md:text-3xl">{title}</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-muted">{description}</p>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 font-bold text-cyan-700 hover:underline dark:text-cyan-400"
        >
          Watch on YouTube <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
      <div className="relative aspect-video min-h-[200px] overflow-hidden rounded-2xl bg-[#0d1b1c]">
        {showPlayer ? (
          <iframe
            ref={player => player?.focus()}
            title={title}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            className="absolute inset-0 h-full w-full"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            aria-label={`Play ${title} (${duration})`}
            onClick={() => setShowPlayer(true)}
            className="group absolute inset-0 grid w-full place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cyan-400"
          >
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              width={480}
              height={360}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <span className="relative grid h-14 w-14 place-items-center rounded-full bg-cyan-400 text-black transition-colors group-hover:bg-cyan-300">
              <Play className="h-6 w-6 fill-current" aria-hidden />
            </span>
            <span aria-hidden className="absolute bottom-3 right-3 rounded-md bg-black/85 px-2 py-1 text-xs font-semibold text-white">{duration}</span>
          </button>
        )}
      </div>
    </section>
  );
}

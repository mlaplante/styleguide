const { useState: _useS_blog } = React;

function BlogNav({ page, onNav }) {
  return (
    <nav className="b-nav">
      <div className="b-nav-inner">
        <a className="b-brand" onClick={() => onNav('index')}>Michael LaPlante</a>
        <ul className="b-links">
          <li><a className={page === 'index' ? 'active' : ''} onClick={() => onNav('index')}>blog</a></li>
          <li><a onClick={() => onNav('index')}>archive</a></li>
          <li><a onClick={() => onNav('index')}>categories</a></li>
          <li><a>about</a></li>
        </ul>
      </div>
      <div className="b-progress" />
    </nav>
  );
}

function CategoryPill({ cat }) {
  return <span className={`b-cat b-cat-${cat}`}>{cat}</span>;
}

function PostCard({ post, onOpen }) {
  return (
    <a className="b-card" onClick={() => onOpen(post)}>
      <div className="b-card-meta">
        <CategoryPill cat={post.category} />
        <span className="b-date">{post.date}</span>
        <span className="b-sep">·</span>
        <span className="b-read">{post.read} min read</span>
      </div>
      <h3 className="b-card-title">{post.title}</h3>
      <p className="b-card-excerpt">{post.excerpt}</p>
    </a>
  );
}

function PostList({ posts, onOpen }) {
  return (
    <div className="b-list">
      <header className="b-list-header">
        <h1 className="b-list-title">Writing</h1>
        <p className="b-list-sub">Development sessions, security notes, and thoughts on building resilient systems.</p>
      </header>
      <div className="b-posts">
        {posts.map((p) => <PostCard key={p.slug} post={p} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

function Article({ post, onBack }) {
  return (
    <article className="b-article">
      <button className="b-back" onClick={onBack}>&larr; back to writing</button>
      <header className="b-article-header">
        <div className="b-card-meta">
          <CategoryPill cat={post.category} />
          <span className="b-date">{post.date}</span>
          <span className="b-sep">·</span>
          <span className="b-read">{post.read} min read</span>
        </div>
        <h1 className="b-article-title">{post.title}</h1>
        <p className="b-article-lead">{post.excerpt}</p>
      </header>
      <div className="b-article-body">
        <p>
          When Netlify announced their function pricing changes, I started looking for alternatives
          for the portfolio contact form. The existing setup was a standard serverless function —
          short, pragmatic, and locked to a single vendor.
        </p>
        <h2>Goal</h2>
        <p>
          Move the form off Netlify Functions and onto a Cloudflare Worker, keeping the same
          Turnstile verification, rate-limiting, and email delivery — with zero Netlify-specific
          code left behind once we're done.
        </p>
        <h2>The migration</h2>
        <p>
          Cloudflare Workers give us a lot of the same affordances as Netlify Functions: a small
          request/response handler, a generous free tier, and first-class edge deployment. The
          differences are mostly in how secrets and bindings are declared in
          <code>wrangler.toml</code>, and in which runtime globals are available.
        </p>
        <blockquote>
          "The point isn't that Cloudflare is better than Netlify — it's that our infrastructure
          should survive a vendor outage, a pricing change, or a routine platform pivot without
          rewriting the app."
        </blockquote>
        <h2>What we kept</h2>
        <ul>
          <li>Turnstile bot protection in front of every submission</li>
          <li>A per-IP rate limit (10 requests / 15 minutes)</li>
          <li>Postmark for transactional delivery</li>
        </ul>
        <p>
          The working version is deployed and the old Netlify function is gone. Total round-trip
          time — from first commit to production — was under four hours.
        </p>
      </div>
    </article>
  );
}

Object.assign(window, { BlogNav, CategoryPill, PostCard, PostList, Article });

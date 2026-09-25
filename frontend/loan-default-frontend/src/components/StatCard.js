import React from "react";

function StatCard({
  title,
  value,
  subtitle,
  icon,
  className
}) {

  return (
    <div className="stat-card">

      <div className="stat-card-top">

        <div>
          <span className="stat-title">
            {title}
          </span>

          <h2>
            {value}
          </h2>

          <p>
            {subtitle}
          </p>
        </div>

        <div className={`stat-icon ${className}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;
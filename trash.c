URL=http://localhost:5173/ventidy-control-7392

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-navy-100/70 dark:border-white/10 bg-white/95 dark:bg-navy-950/95 backdrop-blur-2xl lg:hidden shadow-xl"
          >
            <div className="flex flex-col gap-1.5 px-5 py-4">
              {NAV_LINKS.map((link) => {
                const IconComponent = link.icon
                const isActive = activeSection === link.to
                return (
                  <button
                    key={link.to}
                    onClick={() => scrollToSection(link.to)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive
                      ? 'bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-sky-400 font-semibold'
                      : 'text-navy-700 hover:bg-navy-50/80 dark:text-white/80 dark:hover:bg-white/5'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-4 w-4 opacity-75" />
                      <span>{link.label}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                  </button>
                )
              })}

              {/* Mobile CTA */}
              <div className="mt-3 pt-3 border-t border-navy-100/60 dark:border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => scrollToSection("contact")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand-600 via-blue-600 to-sky-500 shadow-md active:scale-98"
                >
                  <span>Request Free Inspection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="tel:+919940110079"
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium text-navy-700 dark:text-ice bg-navy-50 dark:bg-white/5 border border-navy-100 dark:border-white/10"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-600 dark:text-sky-400" />
                  <span>Call +91 9940110079</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
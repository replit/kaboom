// cacheless import

module.exports = function(mod) {
	delete require.cache[require.resolve(mod)];
	return require(mod);
};


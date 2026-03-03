# Quantifying Clipping Softness

## Definitions

A **clipping function** $f$ shall be any function that is non-linear, differentiable, and monotonically increasing. Clipping is a form of wave shaping, so it must be non-linear by definition. Monotonicity rules out wave folding effects, the function's output must not change when increasing input beyond it's limits. Additionally, $f'$ shall be unimodal (bell shaped) and nonnegative for all real inputs. This means that $f$ must be a Sigmoid-shadped function. 

For any meaningful analysis the clipping function must be normalized. For any clipping function $f$, a **normalized clipping function** $f_1$ is defined as
$$
f_1(x) = A_\text{out} f(A_\text{in} x),
$$
where $A_\text{in}$ is the **input gain** and $A_\text{out}$ is the **output gain**. 

Simplified clipping hardness $H_f$ and softness $S_f$ of any given clipping function can be defined as
$$
\begin{align*}
H_f	&= \max(|f_1''(x)|) \\
S_f	&= \frac{1}{H_f}.
\end{align*}
$$
The maximum absolute value of the second derivate describes how abruptly a signal changes it's behavior. It is  analogous to acceleration in kinematics. We only care about it's magnitude, thus absolute value is taken.

If $g(x) = h(kx)$, where $k$ is constant, then the chain rule gives us
$$
\begin{align*}
g'(x)  &= k h'(k x)
g''(x) &= k^2 h''(k x),
\end{align*}
$$
which allows us to determine hardness in terms of unnormalized clippers like so:
$$
\begin{equation}
H_f = \max(| A_\text{out} A_\text{in}^2 f''(A_\text{in} x) |). \label{hardness}
\end{equation}
$$

The simplified model assumes symmetric clipping and one local extreme for the second derivate on each side of the $x$ axis. We will focus on this type of simplified clipping on this study. Real world clippers may be (and commonly are) asymmetric, and they might have multiple local extrema, which might be the case when composing clippers.

Clippers can be categorized in three catgories:

- **Bounded** clippers cannot increase their output once some limit is reached. In other words, bounded clippers are piece-wise functions that have zero derivative beyond any given amplitude limit.
- **Converging** clippers have a limit when approaching infinity. Derivative never gets to zero.
- **Diverging** clippers do not converge. Derivative never gets to zero.

## Hard Clipping

Our model is already powerful enough to do analysis of **hard clipper** $h$. Hard clipper is a special case that does not need to be normalized to determine it's hardness and softness, so we will set it's input and output gains to one. We only need to consider the other side of the waveform for this analysis, we will use the positive side. A hard clipper will be linear until a threshold $T$ is reached after which the output stays constant. We will set this threshold to one. Then, a positive side hard clipper can be described as
$$
h(x) = \begin{cases}
		x, & x < 1 \\
		1, & x \ge 1.
	\end{cases}
$$
A hard clipper is not differentiable, and thus, not a valid clipping function on it's own. However, we can approximate it using a soft clipper $s$. A soft clipper also has a clipping threshold, but it also has a variable knee size $k \in (0, 1]$. A knee with zero size would be equivalent of not having a knee at all, which would be hard clipping. This soft clipper is linear below $T - k$, constant above $T + k$, and uses quadratic spline $P$ to interpolate smoothly between $T - k$ to $T + k$. The resulting function is a valid clipping function, however we are only using it to analyze hard clipping, so we will ignore normalization. Then, a positive side soft clipper can be described as
$$
\begin{align*}
P(x) &= ax^2 + bx + c \\
a    &= -\frac{1}{4k} \\
b    &= \frac{1}{2} + \frac{1}{2k} \\
c    &= \frac{1}{2} - \frac{1}{4k} - \frac{1}{4}k \\
s(x) &= \begin{cases}
		x,		& x < 1 - k \\
		P(x),	& 1 - k \le x < 1 + k \\
		1,		& 1 + k \le x.
	\end{cases}
\end{align*}
$$
It is trivial to see that the maximum of the second derivative of the soft clipper is completely determined by the spline. We can also see that 
$$
H_{s+} = \max(-s''(x)) = \max(-a) = \frac{1}{4k},
$$
so the hardness of $s$ is completely determined by $k$ and the limit of hardness and softness of the soft clipper as the knee size approaches to hard clipping is
$$
\begin{align*}
H_h &= \lim_{k \to 0+} \frac{1}{4k} = \infty \\
S_h &= \lim_{k \to 0+} \frac{1}{H_h} = 0,
\end{align*}
$$
which seems rather intuitive.

The analysis for negative side would be identical of course. However, it should be noted that asymmetrical hard clipping will always have a softness of zero, regardless of clipping thresholds of either side. In fact, the other side may not be clipped at all and the result is still zero. This may seem confusing and like it could undermine the usefulness of the model. And indeed, fully asymmetrical (one side linear) clipping will have a very distinct sound from symmetrical clipping. However, both asymmetrical and symmetrical hard clipping have an important property: once a threshold is reached (doesn't matter which one or both), the sound is immediately notably distorted. The ambiguity of the clipping threshold is what softness is measuring, a complete description of tonal characteristics of any given clipping function is outside of the scope of this study.

While we only needed to consider simplified unipolar hard clipper and soft clipper, their complete descriptions can be very useful for DSP or other purposes. So for completeness, the full generic description of asymmetric hard clipper and soft clipper is as follows:
$$
\begin{align*}
h(x) &= \begin{cases}
		T_-, & x < T_- \\
		x,   & T_- \le x < T_+ \\
		T_+, & T_+ \le x
	\end{cases} \\

P_+(x) &= -\frac{1}{4k_+}x^2 
			+ \left( \frac{1}{2} + \frac{T_+}{2k_+} \right)x 
			+ \left( -\frac{T_+^2}{4k_+}+\frac{T_+}{2}-\frac{k_+}{4} \right) \\

P_-(x) &= \frac{1}{4k_-}x^2 
			+ \left( \frac{1}{2} - \frac{T_-}{2k_-} \right)x 
			+ \left( \frac{T_-^2}{4k_-}+\frac{T_-}{2}+\frac{k_-}{4} \right) \\

s(x) &= \begin{cases}
		T_-,     & x \le T_- - k_- \\
		P_-(x), & T_- - k_- < x \le T_- + k_- \\
		x,		& T_- + k_- < x < T_+ - k_+ \\
		P_+(x),	& T_+ - k_+ \le x < T_+ + k_+ \\
		T_+,	& T_+ + k_+ \le x,
	\end{cases}
\end{align*}
$$
where $T_- < 0$, $T_+ > 0$, $k_- \in (0, -T_-]$, and $k_+ \in (0, T_+]$. Symmetric hard and soft clippers are simpler:
$$
\begin{align*}

h(x) &= \begin{cases}
		x, & |x| < T \\
		T \, \text{sign}(x), & |x| \ge T
	\end{cases} \\

P(x) &= -\frac{1}{4k} 
		+ \left( \frac{1}{2} + \frac{T}{2k} \right)x
		+ \left( -\frac{T^2}{4k}+\frac{T}{2}-\frac{k}{4} \right) \\

s(x) &= \begin{cases}
		x, & |x| < T - k \\
		\text{sign}(x)P(|x|), & T - k \le |x| < T + k \\
		T\,\text{sign}(x), & T + k \le |x|,
	\end{cases}

\end{align*}
$$
where $T > 0$ and $k \in (0, T]$. 

## Normalization

The input gain controls the amount of clipping distortion. The amount of clipping will clearly alter the subjective and objective distortion characteristics, so it must be normalized. Input gain affects the output level, but not the other way around, so input gain must be normalized before output gain normalization. Clipping results to harmonic distortion, so input gain will be normalized by measuring the **total harmonic distortion** (**THD**) of the clipping function by passing $\sin(\pi x)$ with an amplitude of one to it. When possible, the best results could be obtained by deriving closed form coefficients for the Fourier series, but often this can be cumbersome or even impossible. A generic numerical approach could be to calculate the coefficients using [discrete Fourier transform](TODO). This seems expensive (and to some extent it definitely is), but it is not too bad for symmetric clippers, because we only need to compute coefficients for odd sine terms, cosines and even terms cancel out to zero.

The value of THD for normalization will affect softness. Consider any clipper that has some bounded limit like the quadratic soft clipper. Given a periodic input, large amounts of input gain would make the output to converge to a square wave with well defined amplitude. But many soft clippers (like $\arctan(x)$) do not converge. The resulting output of such functions do not necessarily resemble a square wave as closely with large amounts of input gain making it sound smoother. With lower gains, however, $\arctan(x)$ has more noticeable clipping threshold, which is described well by the extreme of the second derivative. We will be focusing on more modest input gains (e.g. potentially used by mixing engineers and semi-clean guitar tones) in this study.

We will define the input domain to be $x \in [-1, 1]$, which will also be used for relevant integration bounds. We will use real numbers instead of voltages or discrete values to retain generality to be applicable to digital and analog domains. It is important to note that in most cases this domain will only represent a subdomain of a system being modeled. Unfortunately, this means that we will lose some information. Consider the inverting amplifier diode soft clipper, which is a relatively common circuit used in guitar effects pedals. If we set the feedback resistor to a high value, we can approximate the circuit as a bipolar logarithm amplifier. According to [this article](https://www.analog.com/en/resources/analog-dialogue/articles/logarithmic-amplifiers-explained.html), such amplifier can be approximately modeled with an inverse hyperbolic sine $\text{arcsinh}(x$). The clipping threshold of this function is determined by the diode's forward voltage, which is typically approximated to be 0.6 V to 0.7 V for silicon P-N diodes. However, $\text{arcsinh}(x)$ does not converge, so the domain of this circuit is going to be the rails voltage, which could be as large as ±9 V for some pedals. Any signal that is large enough to reach the rails despite diode clipping will be very close to a square wave due to diode clipping. There is no use analyzing such functions in their full domains, so it is acceptable to only observe the subdomain where the clipping is the most pronounced. It is also required to limit the domain for any meaningful THD normalization, which is what we do for fairness anyway. 

The output gain controls the overall volume. It does not change the clipping characteristics, but the hardness (the second derivative) is directly proportional to it, so it must be normalized. It will be normalized by total power of the clipping function given some signal, which is commonly described by **root mean square** (**RMS**):
$$
\begin{equation}
\text{RMS} = \sqrt{ \int_{-1}^{1} x(t)^2 \,dx } \label{rms}
\end{equation}
$$

We must choose an input signal for the measurement. It might be tempting to use a sinusoid, since that is what we needed to use to measure and normalize input gain, but the probelm with that is that real world audio is rarely just a pure sinusoid. We need a signal that is roughly an average of all signals in some sense. A good candidate could be **Gaussian noise**, which has a **probability mass function** that follows the normal distribution. The **probability mass** describes how likely it is for a sample to get a specific value. This is important for us, because we need heuristics to determine how our clipping function would transform any given input values to output values on average. Since we cannot know our input signals, a probabilistic approach seems appropriate.

Gaussian noise does have one huge issue for practical measurements: we would need to generate a huge amount of samples of it in order to converge. This could be done using any psuedo-random number generator and [Box-Muller transform](https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform), but it would require huge amount of processing before it gets useful. Luckily, we don't need Gaussian noise, we just need anything that will give us a similar probability mass. It turns out that sampling the [quantile function](https://en.wikipedia.org/wiki/Quantile_function) of any given distribution enough times at regular intervals will yield the corresponding probability mass. This means that as our signal we can use the quantile function of a Gaussian called the [probit function], which can be computed using
$$
\text{probit}(t) = \sqrt{2} \text{erf}^{-1}(2t - 1),
$$
where $t \in (0, 1)$ and $\text{erf}^{-1}$ is the inverse of the error function. So finally, using $\eqref{rms}$, we get our output gain normalization:
$$
\begin{align*}
\text{RMS}_f   &= \sqrt{ \int_{-1}^{1} f(A_{\text{in}} \text{probit}(t))^2 \,dt }
A_{\text{out}} &= \frac{1}{\text{RMS}_f}
\end{align*}
$$

## The Blunter

There exists a symmetric clipper that is smoother than any other symmetric clipper for a range of THD normalization values, which we will call **the Blunter**. We will be referring to it quite a lot, so it worth defining and naming it. The unnormalized Blunter is defined as 
$$
\begin{align*}
B(x) &= \begin{cases}
		2x - |x|x,      & |x| \le 1 \\
		\text{sign}(x), & |x| \gt 1
	\end{cases} \\
	&= \begin{cases}
		-1,       & x \lt -1  \\
		2x + x^2, & -1 \le x \lt 0 \\
		2x - x^2, & 0 \le x \le 1 \\
		1,        & 1 \lt x.
	\end{cases}
\end{align*}
$$
The normalized Blunter is
$$
B_1(x) = A_{B\text{out}} B(A_{B\text{in}} x).
$$
The Blunter is equivalent to our quadratic soft clipper when knee $k = T$ the only difference being normalization constants, so again, it's hardness is determined by the polynomial. Using $\eqref{hardness}$ and $(x - 2x^2)'' = 2$, the hardness of the Blunter is
$$
H_B = 2 A_{B\text{out}} B(A_{B\text{in}}^2 B(A_{B\text{in}}.
$$
Considering that our input domain is limited, if normalized THD value is high, then Blunter's second derivative is a step function. If normalized THD is low, then we would only consider Blunter's polynomial section making it's second derivative constant. We will set the normalized THD to be a value such that the input domain fits exactly in Blunter's full polynomial section. With this normalized input gain, for any other clipper to be smoother, they would have to have the magnitude of their second derivatives smaller tha $H_B$ for all $x$. Considering that the second derivative filters out the linear component of the clipping function, it would most certainly indicate that either the input, the output gain, or both are unnormalized. This is a bit difficult to prove analytically, but it can be experimentally shown that Blunter is indeed the smoothest clipper.

## Finding the Softest Clipper

[This repository](https://github.com/PrinssiFiestas/soft-clipper-analysis) contains code for multiple experiments and tests for this study. The main experiment generates all potential symmetric clipping functions with given precision `BASE`. For each of the generated functions, a normalized input gain and output gain is calculated to finally find the hardness of the function. Finally, the function with minimum hardness is found. `f` and `f_*` refer to clipping function lookup-tables. 

### Counter

An algorithm was developed that generates all potential clipping functions given a discrete precision of `BASE`. The basic idea is based on a counter: take `BASE` number of digits and start counting in that `BASE`. The generated sequence of numbers will be represent the positive side of a clipping function as a lookup table. By counting all numbers, we can ensure that each clipping function has in fact been generated. However, this naïve approach would have a time complexity of $O(\text{n}^\text{n})$, where $n = \text{BASE}$, so we need to find a way of skipping as many counts as possible. Our counting algorithm (starting from the LEFTMOST digit) can be described with the following steps:

1. Knowing that the first derivative of a valid clipping function must be greater than or equal to zero, each time we increment a digit in the middle to a value that is greater than the digit on it's right side, we can duplicate the incremented digit to all of the digits on the right side (flush). 

`TODO some nice figure`

2. Also knowing that the first derivative is decreasing and cannot go below zero, we can skip all increments from the right that would increase the derivative from zero to one.

`TODO some other nice figure`

3. The next few functions can be obtained by incrementing and flushing the next digits on the right by using the same reasoning. The index for flushed digit can be cached to keep track where to flush next. Incrementing and flushing can be done as long as the digit is smaller than `BASE`.

`TODO more figures`

4. Since we are conceptually counting numbers here, once a digit equals `BASE`, the digit from the left must be incremented. However, the first derivative is known to be decreasing, we can only increment the leftmost digit of a segment with same derivative--increasing any digit on the right side would increase the derivative, so find where the derivative changes and increment that.

`TODO one more figure`

5. If the first digit equals `BASE`, then we are done. Otherwise, go to step one.

This algorithm only generates the positive side of the clipper lookup table. To generate the full table, it can easily be duplicated to the negative size with sign flipped. However, to preserve symmetry and monotonicity, an element has to be prepended to the positive side that always has zero value and counting should be done with digits ranging from one to `BASE`. Code for generating next function in sequence is called `f_next()`, which can be found in [shared.h](https://github.com/PrinssiFiestas/soft-clipper-analysis/blob/main/src/shared.h). It has been verified to find all valid function tables by comparing it's result to naïve counter.

The precision of the generated tables is horrific at this point. Not only our lookup table consists of small integers, but the derivative also decreases in discrete steps. This means that the second derivative would consist of large spikes at these steps and zeroes otherwise, so we must smooth out the steps. 

`TODO spike figure?`

### Filter

To smooth out the discrete steps, we had to process the clipper lookup table with a smoothing filter. The filtering had three major requirements:

- Good step response: the filter should preserve the clippers overall shape.
- Good stopband attenuation: the derivatives are extremely sensitive to high frequencies.
- Zero-phase: `f[0]` must be zero.

The first two requirements are somewhat conflicting, but a good compromize was found by using a single pole IIR low-pass filter with a relatively low cutoff. Being somewhat heavy handed with the cutoff was justified by the fact than any clipper with hard edges could not be the smoothest. Being single pole, the overall shape of the clipper was preserved well, and low cutoff gave reasonably good attenuation at high frequencies. To keep it zero phase, the clipper would be duplicated, then both duplicates would be filtered, the first one from right to left, the other one from left to right. Then results were added together for the final zero-phase result. As an added bonus, being IIR, the step response allows generating very good converging clippers. 

Any low-pass filter will ruin the first samples it processes, so we had to extrapolate our clippers. We chose to do quadratic extrapolation by finding the first and second differing samples from the edges to estimate first and second derivatives at the edges. This implicitly assumes non-zero first derivative, which unfortunately slightly reduced the generators capability to generate bounded clippers, but it considerably improved it's capability to generate converging and diverging clippers, so it was worth it. 

### Normalization

Input gain was normalized by finding the input gain value that matched our normalized THD value. Any hopes of using some analytical formula was futile--the clipper could be literally any valid clipper. However, we observed that secant method gave us really good approximations very fast (TODO(can't remember number) iterations on average). The DFTs for THD calculations were calculated using fixed point integers and pre-calculated tables of sines of frequencies of harmonics to improve computation speed.

To find the good initial guesses for secant method, we plotted THD as function of input gain of large number of generated clipper functions. The first guess would be simply the input gain that on average gives the normalized result. For second guess, we noted that input gain cannot be negative because THD is calculated from squared coefficients. This allowed us to find a minimum point where $\text{THD} \approx 0$. Having our first evaluated value at the first guess and the average minimum point, we could get the next estimate. 

`TODO THD scatter plot`

Input gain normalization was trivial using TODO(ref).

The filtered generator was tested by testing if it actually finds a diverging clipper, converging clipper, and a bounded clipper by finding the generated normalized functions with minimal differences from the three functions. We chose $arctan$, a symmetric variant of the logistic function, and of course the Blunter. Figure TODO shows these differences in base of TODO. As we can see, the generated functions match very well for the most part, but the extrapolation adds a little bit of noise at the ends. This however was not very significant, and the matching greatly improves when increasing `BASE`.

### Hardness

The final part was to compute the second difference of the clipper and find it's minimum. Then, using chain rule we get
$$
\begin{align*}
f_1(x)   &= A_\text{out} f(A_\text{in} x)
f_1'(x)  &= A_\text{out} A_\text{in} f'(A_\text{in} x)
f_1''(x) &= A_\text{out} A_\text{in}^2 f''(A_\text{in} x)
\end{align*}
$$
giving us the hardness of
$$
H_f = | A_\text{out} A_\text{in}^2 \min(f''(A_\text{in} x)) |.
$$

### Results